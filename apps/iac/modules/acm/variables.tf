variable "project" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, prd)"
  type        = string
}

variable "domain_name" {
  description = "Primary domain name for the certificate"
  type        = string
}

variable "subject_alternative_names" {
  description = "Subject alternative names for the certificate"
  type        = list(string)
  default     = []
}

variable "route53_zone_id" {
  description = "Route53 hosted zone ID for DNS validation"
  type        = string
}

variable "create_regional_certificate" {
  description = "Create certificate in regional (non us-east-1) region"
  type        = bool
  default     = true
}

variable "regional_region" {
  description = "AWS region for regional certificate (e.g., ap-northeast-1)"
  type        = string
  default     = "ap-northeast-1"
}
