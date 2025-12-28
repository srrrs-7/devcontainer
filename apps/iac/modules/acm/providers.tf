# ACM module - self-contained providers
# CloudFront certificates must be created in us-east-1 region
# Regional certificates are created in the specified region

terraform {
  required_version = ">= 1.9.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

# Provider for us-east-1 (required for CloudFront certificates)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

# Provider for regional resources (API Gateway, ALB, etc.)
provider "aws" {
  alias  = "regional"
  region = var.regional_region
}
