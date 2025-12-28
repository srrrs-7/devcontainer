output "cloudfront_certificate_arn" {
  description = "CloudFront certificate ARN (us-east-1)"
  value       = aws_acm_certificate.cloudfront.arn
}

output "cloudfront_certificate_domain_validation_options" {
  description = "CloudFront certificate domain validation options"
  value       = aws_acm_certificate.cloudfront.domain_validation_options
}

output "cloudfront_certificate_status" {
  description = "CloudFront certificate status"
  value       = aws_acm_certificate.cloudfront.status
}

output "regional_certificate_arn" {
  description = "Regional certificate ARN"
  value       = var.create_regional_certificate ? aws_acm_certificate.regional[0].arn : null
}

output "regional_certificate_status" {
  description = "Regional certificate status"
  value       = var.create_regional_certificate ? aws_acm_certificate.regional[0].status : null
}

output "validated_cloudfront_certificate_arn" {
  description = "Validated CloudFront certificate ARN"
  value       = aws_acm_certificate_validation.cloudfront.certificate_arn
}

output "validated_regional_certificate_arn" {
  description = "Validated regional certificate ARN"
  value       = var.create_regional_certificate ? aws_acm_certificate_validation.regional[0].certificate_arn : null
}
