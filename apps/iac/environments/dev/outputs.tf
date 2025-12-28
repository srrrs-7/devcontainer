output "vpc_id" {
  description = "VPC ID"
  value       = module.vpc.vpc_id
}

output "ecr_repository_url" {
  description = "ECR repository URL"
  value       = module.ecr.repository_url
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = module.ecs.cluster_name
}

output "ecs_service_name" {
  description = "ECS service name"
  value       = module.ecs.service_name
}

output "api_gateway_endpoint" {
  description = "API Gateway endpoint"
  value       = module.api_gateway.api_endpoint
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = module.s3_cloudfront.cloudfront_distribution_id
}

output "cloudfront_domain_name" {
  description = "CloudFront domain name"
  value       = module.s3_cloudfront.cloudfront_domain_name
}

output "s3_bucket_id" {
  description = "S3 bucket ID for SPA"
  value       = module.s3_cloudfront.s3_bucket_id
}

output "aurora_cluster_endpoint" {
  description = "Aurora cluster endpoint"
  value       = module.aurora.cluster_endpoint
}

output "aurora_cluster_reader_endpoint" {
  description = "Aurora cluster reader endpoint"
  value       = module.aurora.cluster_reader_endpoint
}

output "aurora_secrets_manager_arn" {
  description = "Aurora Secrets Manager secret ARN"
  value       = module.aurora.secrets_manager_secret_arn
}

output "app_url" {
  description = "Application URL"
  value       = "https://${var.app_domain_name}"
}
