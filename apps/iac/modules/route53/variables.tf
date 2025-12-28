variable "project" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, prd)"
  type        = string
}

variable "domain_name" {
  description = "Root domain name"
  type        = string
}

variable "subdomain" {
  description = "Subdomain for the application (empty for root domain)"
  type        = string
  default     = ""
}

variable "create_hosted_zone" {
  description = "Create new hosted zone (false to use existing)"
  type        = bool
  default     = false
}

variable "create_www_record" {
  description = "Create www subdomain record"
  type        = bool
  default     = true
}

variable "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  type        = string
  default     = null
}

variable "cloudfront_hosted_zone_id" {
  description = "CloudFront distribution hosted zone ID"
  type        = string
  default     = null
}

variable "api_subdomain" {
  description = "Subdomain for API (default: api)"
  type        = string
  default     = ""
}

variable "api_gateway_domain_name" {
  description = "API Gateway custom domain name"
  type        = string
  default     = null
}

variable "api_gateway_hosted_zone_id" {
  description = "API Gateway hosted zone ID"
  type        = string
  default     = null
}
