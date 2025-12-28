output "cluster_id" {
  description = "Aurora cluster ID"
  value       = aws_rds_cluster.main.id
}

output "cluster_arn" {
  description = "Aurora cluster ARN"
  value       = aws_rds_cluster.main.arn
}

output "cluster_endpoint" {
  description = "Aurora cluster writer endpoint"
  value       = aws_rds_cluster.main.endpoint
}

output "cluster_reader_endpoint" {
  description = "Aurora cluster reader endpoint"
  value       = aws_rds_cluster.main.reader_endpoint
}

output "cluster_port" {
  description = "Aurora cluster port"
  value       = aws_rds_cluster.main.port
}

output "database_name" {
  description = "Database name"
  value       = aws_rds_cluster.main.database_name
}

output "master_username" {
  description = "Master username"
  value       = aws_rds_cluster.main.master_username
  sensitive   = true
}

output "security_group_id" {
  description = "Aurora security group ID"
  value       = aws_security_group.aurora.id
}

output "writer_instance_id" {
  description = "Writer instance ID"
  value       = aws_rds_cluster_instance.writer.id
}

output "reader_instance_id" {
  description = "Reader instance ID"
  value       = var.create_reader_instance ? aws_rds_cluster_instance.reader[0].id : null
}

output "secrets_manager_secret_arn" {
  description = "Secrets Manager secret ARN"
  value       = var.create_secrets_manager_secret ? aws_secretsmanager_secret.db_credentials[0].arn : null
}

output "kms_key_arn" {
  description = "KMS key ARN"
  value       = var.create_kms_key ? aws_kms_key.aurora[0].arn : var.kms_key_arn
}
