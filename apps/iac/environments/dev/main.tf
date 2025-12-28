# Development Environment Configuration
# This configuration uses cost-optimized settings suitable for development

terraform {
  required_version = ">= 1.9.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Backend configuration - uncomment and configure for your environment
  # backend "s3" {
  #   bucket         = "your-terraform-state-bucket"
  #   key            = "play-devcontainer/dev/terraform.tfstate"
  #   region         = "ap-northeast-1"
  #   encrypt        = true
  #   dynamodb_table = "terraform-state-lock"
  # }
}

# Default provider (ap-northeast-1)
provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = var.project
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}

# Data sources
data "aws_caller_identity" "current" {}

data "aws_route53_zone" "main" {
  name         = var.domain_name
  private_zone = false
}

# VPC Module
module "vpc" {
  source = "../../modules/vpc"

  project     = var.project
  environment = var.environment
  vpc_cidr    = var.vpc_cidr
  az_count    = 2

  enable_nat_gateway = true
  single_nat_gateway = true # Cost optimization for dev
  enable_flow_logs   = false
}

# ECR Module
module "ecr" {
  source = "../../modules/ecr"

  project     = var.project
  environment = var.environment

  image_tag_mutability          = "MUTABLE"
  scan_on_push                  = true
  max_image_count               = 10
  untagged_image_retention_days = 3
}

# ACM Module
module "acm" {
  source = "../../modules/acm"

  project                     = var.project
  environment                 = var.environment
  domain_name                 = var.app_domain_name
  subject_alternative_names   = ["www.${var.app_domain_name}"]
  route53_zone_id             = data.aws_route53_zone.main.zone_id
  create_regional_certificate = true
  regional_region             = var.aws_region
}

# WAF Module
module "waf" {
  source = "../../modules/waf"

  project     = var.project
  environment = var.environment

  enable_sql_injection_protection = true
  enable_linux_protection         = true
  enable_rate_limiting            = true
  rate_limit                      = 1000 # Lower limit for dev

  log_retention_days = 7
}

# Cognito Module
module "cognito" {
  source = "../../modules/cognito"

  project     = var.project
  environment = var.environment

  callback_urls = [
    "https://${var.app_domain_name}/auth/callback",
    "http://localhost:3000/auth/callback" # Dev only
  ]
  logout_urls = [
    "https://${var.app_domain_name}",
    "http://localhost:3000" # Dev only
  ]

  google_client_id     = var.google_client_id
  google_client_secret = var.google_client_secret
}

# ECS Module
module "ecs" {
  source = "../../modules/ecs"

  project            = var.project
  environment        = var.environment
  aws_region         = var.aws_region
  vpc_id             = module.vpc.vpc_id
  vpc_cidr           = module.vpc.vpc_cidr
  private_subnet_ids = module.vpc.private_subnet_ids

  container_image   = "${module.ecr.repository_url}:latest"
  container_port    = 8080
  task_cpu          = 256
  task_memory       = 512
  desired_count     = 1
  health_check_path = "/health"

  environment_variables = {
    NODE_ENV             = "development"
    LOG_LEVEL            = "debug"
    DB_HOST              = module.aurora.cluster_endpoint
    DB_PORT              = tostring(module.aurora.cluster_port)
    DB_DBNAME            = var.db_name
    COGNITO_USER_POOL_ID = module.cognito.user_pool_id
    COGNITO_CLIENT_ID    = module.cognito.spa_client_id
    COGNITO_ISSUER       = module.cognito.issuer
    COGNITO_JWKS_URI     = module.cognito.jwks_uri
  }

  secrets = {
    DB_USERNAME = module.aurora.secrets_manager_secret_arn
    DB_PASSWORD = module.aurora.secrets_manager_secret_arn
  }

  secrets_arns = [module.aurora.secrets_manager_secret_arn]

  enable_container_insights   = false # Cost optimization
  use_fargate_spot            = true  # Cost optimization
  log_retention_days          = 7
  enable_deletion_protection  = false
  enable_autoscaling          = false # Disable for dev
}

# API Gateway Module
module "api_gateway" {
  source = "../../modules/api_gateway"

  project            = var.project
  environment        = var.environment
  subnet_ids         = module.vpc.private_subnet_ids
  security_group_ids = [module.ecs.security_group_id]
  nlb_listener_arn   = module.ecs.nlb_listener_arn

  log_retention_days     = 7
  throttling_burst_limit = 1000
  throttling_rate_limit  = 2000

  cors_allow_origins = ["https://${var.app_domain_name}", "http://localhost:3000"]
}

# S3 + CloudFront Module
module "s3_cloudfront" {
  source = "../../modules/s3_cloudfront"

  project        = var.project
  environment    = var.environment
  aws_account_id = data.aws_caller_identity.current.account_id

  domain_names         = [var.app_domain_name, "www.${var.app_domain_name}"]
  acm_certificate_arn  = module.acm.validated_cloudfront_certificate_arn
  waf_web_acl_arn      = module.waf.web_acl_arn
  api_gateway_endpoint = module.api_gateway.api_endpoint

  cloudfront_price_class = "PriceClass_200"
  enable_versioning      = false # Cost optimization
  logs_retention_days    = 7

  depends_on = [module.acm, module.waf]
}

# Route53 Module
module "route53" {
  source = "../../modules/route53"

  project     = var.project
  environment = var.environment
  domain_name = var.domain_name

  cloudfront_domain_name    = module.s3_cloudfront.cloudfront_domain_name
  cloudfront_hosted_zone_id = module.s3_cloudfront.cloudfront_hosted_zone_id

  create_www_record = true
}

# Aurora Serverless v2 Module
module "aurora" {
  source = "../../modules/aurora"

  project                 = var.project
  environment             = var.environment
  vpc_id                  = module.vpc.vpc_id
  subnet_ids              = module.vpc.database_subnet_ids
  allowed_security_groups = [module.ecs.security_group_id]

  engine_version  = "16.4"
  database_name   = var.db_name
  master_username = var.db_username
  master_password = var.db_password

  min_capacity = 0.5 # Minimum for cost optimization
  max_capacity = 2   # Low max for dev

  backup_retention_period = 1
  skip_final_snapshot     = true
  deletion_protection     = false
  apply_immediately       = true

  create_reader_instance = false # No reader for dev

  performance_insights_enabled  = false # Cost optimization
  enhanced_monitoring_interval  = 0     # Disabled for cost

  create_kms_key                = true
  create_secrets_manager_secret = true
}
