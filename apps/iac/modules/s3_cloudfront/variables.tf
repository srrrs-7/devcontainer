variable "project" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, prd)"
  type        = string
}

variable "aws_account_id" {
  description = "AWS Account ID"
  type        = string
}

variable "domain_names" {
  description = "List of domain names for CloudFront aliases"
  type        = list(string)
  default     = []
}

variable "acm_certificate_arn" {
  description = "ACM certificate ARN for HTTPS"
  type        = string
  default     = null
}

variable "waf_web_acl_arn" {
  description = "WAF Web ACL ARN"
  type        = string
  default     = null
}

variable "api_gateway_endpoint" {
  description = "API Gateway endpoint URL"
  type        = string
  default     = null
}

variable "cloudfront_price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_200" # Use only US, Canada, Europe, Asia, Middle East, and Africa
}

variable "enable_versioning" {
  description = "Enable S3 bucket versioning"
  type        = bool
  default     = true
}

variable "geo_restriction_type" {
  description = "Geo restriction type (none, whitelist, blacklist)"
  type        = string
  default     = "none"
}

variable "geo_restriction_locations" {
  description = "List of country codes for geo restriction"
  type        = list(string)
  default     = []
}

variable "logging_bucket" {
  description = "S3 bucket for CloudFront logs (if null, creates new bucket)"
  type        = string
  default     = null
}

variable "logs_retention_days" {
  description = "CloudFront logs retention in days"
  type        = number
  default     = 90
}
