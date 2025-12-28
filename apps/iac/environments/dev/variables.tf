variable "project" {
  description = "Project name"
  type        = string
  default     = "play-devcontainer"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "ap-northeast-1"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "domain_name" {
  description = "Root domain name (must have existing Route53 hosted zone)"
  type        = string
}

variable "app_domain_name" {
  description = "Application domain name (e.g., dev.example.com)"
  type        = string
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "app"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "Database master password"
  type        = string
  sensitive   = true
}
