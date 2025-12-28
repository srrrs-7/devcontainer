variable "project" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, prd)"
  type        = string
}

variable "subnet_ids" {
  description = "Subnet IDs for VPC Link"
  type        = list(string)
}

variable "security_group_ids" {
  description = "Security group IDs for VPC Link"
  type        = list(string)
}

variable "nlb_listener_arn" {
  description = "NLB listener ARN for integration"
  type        = string
}

variable "domain_name" {
  description = "Custom domain name for API Gateway"
  type        = string
  default     = null
}

variable "certificate_arn" {
  description = "ACM certificate ARN for custom domain"
  type        = string
  default     = null
}

variable "api_mapping_key" {
  description = "API mapping key for custom domain (e.g., 'api' for api.example.com/api)"
  type        = string
  default     = ""
}

variable "log_retention_days" {
  description = "CloudWatch logs retention in days"
  type        = number
  default     = 30
}

variable "throttling_burst_limit" {
  description = "Throttling burst limit"
  type        = number
  default     = 5000
}

variable "throttling_rate_limit" {
  description = "Throttling rate limit"
  type        = number
  default     = 10000
}

# CORS configuration
variable "cors_allow_credentials" {
  description = "Allow credentials in CORS"
  type        = bool
  default     = false
}

variable "cors_allow_headers" {
  description = "Allowed headers in CORS"
  type        = list(string)
  default     = ["content-type", "x-amz-date", "authorization", "x-api-key", "x-amz-security-token"]
}

variable "cors_allow_methods" {
  description = "Allowed methods in CORS"
  type        = list(string)
  default     = ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"]
}

variable "cors_allow_origins" {
  description = "Allowed origins in CORS"
  type        = list(string)
  default     = ["*"]
}

variable "cors_expose_headers" {
  description = "Exposed headers in CORS"
  type        = list(string)
  default     = []
}

variable "cors_max_age" {
  description = "CORS max age in seconds"
  type        = number
  default     = 86400
}
