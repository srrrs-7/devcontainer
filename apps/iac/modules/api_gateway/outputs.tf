output "api_id" {
  description = "API Gateway HTTP API ID"
  value       = aws_apigatewayv2_api.main.id
}

output "api_endpoint" {
  description = "API Gateway HTTP API endpoint"
  value       = aws_apigatewayv2_api.main.api_endpoint
}

output "api_arn" {
  description = "API Gateway HTTP API ARN"
  value       = aws_apigatewayv2_api.main.arn
}

output "vpc_link_id" {
  description = "VPC Link ID"
  value       = aws_apigatewayv2_vpc_link.main.id
}

output "vpc_link_arn" {
  description = "VPC Link ARN"
  value       = aws_apigatewayv2_vpc_link.main.arn
}

output "stage_id" {
  description = "API Gateway stage ID"
  value       = aws_apigatewayv2_stage.main.id
}

output "custom_domain_name" {
  description = "Custom domain name"
  value       = var.domain_name != null ? aws_apigatewayv2_domain_name.main[0].domain_name : null
}

output "custom_domain_target_domain_name" {
  description = "Target domain name for Route53 alias"
  value       = var.domain_name != null ? aws_apigatewayv2_domain_name.main[0].domain_name_configuration[0].target_domain_name : null
}

output "custom_domain_hosted_zone_id" {
  description = "Hosted zone ID for Route53 alias"
  value       = var.domain_name != null ? aws_apigatewayv2_domain_name.main[0].domain_name_configuration[0].hosted_zone_id : null
}

output "log_group_name" {
  description = "CloudWatch log group name"
  value       = aws_cloudwatch_log_group.api_gateway.name
}
