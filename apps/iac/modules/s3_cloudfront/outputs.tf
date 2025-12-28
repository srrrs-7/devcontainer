output "s3_bucket_id" {
  description = "S3 bucket ID"
  value       = aws_s3_bucket.spa.id
}

output "s3_bucket_arn" {
  description = "S3 bucket ARN"
  value       = aws_s3_bucket.spa.arn
}

output "s3_bucket_domain_name" {
  description = "S3 bucket regional domain name"
  value       = aws_s3_bucket.spa.bucket_regional_domain_name
}

output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.main.id
}

output "cloudfront_distribution_arn" {
  description = "CloudFront distribution ARN"
  value       = aws_cloudfront_distribution.main.arn
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.main.domain_name
}

output "cloudfront_hosted_zone_id" {
  description = "CloudFront distribution hosted zone ID (for Route53 alias)"
  value       = aws_cloudfront_distribution.main.hosted_zone_id
}

output "logs_bucket_id" {
  description = "CloudFront logs bucket ID"
  value       = var.logging_bucket == null ? aws_s3_bucket.logs[0].id : var.logging_bucket
}
