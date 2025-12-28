output "zone_id" {
  description = "Route53 hosted zone ID"
  value       = local.zone_id
}

output "zone_name_servers" {
  description = "Route53 hosted zone name servers"
  value       = var.create_hosted_zone ? aws_route53_zone.main[0].name_servers : null
}

output "cloudfront_record_fqdn" {
  description = "CloudFront DNS record FQDN"
  value       = var.cloudfront_domain_name != null ? aws_route53_record.cloudfront[0].fqdn : null
}

output "api_record_fqdn" {
  description = "API Gateway DNS record FQDN"
  value       = var.api_gateway_domain_name != null ? aws_route53_record.api_gateway[0].fqdn : null
}
