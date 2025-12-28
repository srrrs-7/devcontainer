output "web_acl_id" {
  description = "WAF Web ACL ID"
  value       = aws_wafv2_web_acl.main.id
}

output "web_acl_arn" {
  description = "WAF Web ACL ARN"
  value       = aws_wafv2_web_acl.main.arn
}

output "web_acl_capacity" {
  description = "WAF Web ACL capacity units used"
  value       = aws_wafv2_web_acl.main.capacity
}

output "log_group_name" {
  description = "CloudWatch log group name"
  value       = aws_cloudwatch_log_group.waf.name
}

output "ip_block_list_arn" {
  description = "IP block list ARN"
  value       = length(var.blocked_ip_addresses) > 0 ? aws_wafv2_ip_set.block_list[0].arn : null
}
