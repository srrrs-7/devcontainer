variable "project" {
  description = "Project name"
  type        = string
}

variable "environment" {
  description = "Environment name (dev, prd)"
  type        = string
}

variable "callback_urls" {
  description = "Allowed callback URLs for OAuth"
  type        = list(string)
}

variable "logout_urls" {
  description = "Allowed logout URLs"
  type        = list(string)
}

variable "google_client_id" {
  description = "Google OAuth client ID (optional - leave null to disable Google login)"
  type        = string
  default     = null
  sensitive   = true
}

variable "google_client_secret" {
  description = "Google OAuth client secret (required if google_client_id is set)"
  type        = string
  default     = null
  sensitive   = true
}

variable "access_token_validity_hours" {
  description = "Access token validity in hours"
  type        = number
  default     = 1
}

variable "id_token_validity_hours" {
  description = "ID token validity in hours"
  type        = number
  default     = 1
}

variable "refresh_token_validity_days" {
  description = "Refresh token validity in days"
  type        = number
  default     = 30
}
