output "cluster_id" {
  description = "ECS cluster ID"
  value       = aws_ecs_cluster.main.id
}

output "cluster_arn" {
  description = "ECS cluster ARN"
  value       = aws_ecs_cluster.main.arn
}

output "cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.main.name
}

output "service_id" {
  description = "ECS service ID"
  value       = aws_ecs_service.api.id
}

output "service_name" {
  description = "ECS service name"
  value       = aws_ecs_service.api.name
}

output "task_definition_arn" {
  description = "ECS task definition ARN"
  value       = aws_ecs_task_definition.api.arn
}

output "task_execution_role_arn" {
  description = "ECS task execution role ARN"
  value       = aws_iam_role.task_execution.arn
}

output "task_role_arn" {
  description = "ECS task role ARN"
  value       = aws_iam_role.task.arn
}

output "nlb_arn" {
  description = "NLB ARN"
  value       = aws_lb.nlb.arn
}

output "nlb_dns_name" {
  description = "NLB DNS name"
  value       = aws_lb.nlb.dns_name
}

output "nlb_listener_arn" {
  description = "NLB listener ARN"
  value       = aws_lb_listener.api.arn
}

output "security_group_id" {
  description = "ECS tasks security group ID"
  value       = aws_security_group.ecs_tasks.id
}

output "log_group_name" {
  description = "CloudWatch log group name"
  value       = aws_cloudwatch_log_group.ecs.name
}
