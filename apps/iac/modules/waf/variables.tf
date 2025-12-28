variable "project" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, prd)"
  type        = string
}

variable "enable_sql_injection_protection" {
  description = "Enable SQL injection protection rules"
  type        = bool
  default     = true
}

variable "enable_linux_protection" {
  description = "Enable Linux-specific protection rules"
  type        = bool
  default     = true
}

variable "enable_rate_limiting" {
  description = "Enable rate limiting"
  type        = bool
  default     = true
}

variable "rate_limit" {
  description = "Rate limit per 5 minutes per IP"
  type        = number
  default     = 2000
}

variable "blocked_countries" {
  description = "List of country codes to block"
  type        = list(string)
  default     = []
}

variable "blocked_ip_addresses" {
  description = "List of IP addresses/CIDR blocks to block"
  type        = list(string)
  default     = []
}

variable "ip_block_list_arn" {
  description = "ARN of existing IP set for blocking"
  type        = string
  default     = null
}

variable "common_rules_excluded" {
  description = "Common rules to exclude (count instead of block)"
  type        = list(string)
  default     = []
}

variable "log_retention_days" {
  description = "CloudWatch logs retention in days"
  type        = number
  default     = 30
}

variable "redacted_fields" {
  description = "Fields to redact from logs"
  type = list(object({
    type = string
    name = optional(string)
  }))
  default = [
    { type = "header", name = "authorization" },
    { type = "header", name = "cookie" }
  ]
}
