# Cognito User Pool Module
# Provides authentication for the SPA application with optional Google OAuth integration

data "aws_region" "current" {}

# ===================
# Cognito User Pool
# ===================

resource "aws_cognito_user_pool" "main" {
  name = "${var.project}-${var.environment}-user-pool"

  # Username configuration - use email as username
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  # MFA Configuration - optional for users
  mfa_configuration = "OPTIONAL"
  software_token_mfa_configuration {
    enabled = true
  }

  # Password policy
  password_policy {
    minimum_length                   = 8
    require_lowercase                = true
    require_numbers                  = true
    require_symbols                  = true
    require_uppercase                = true
    temporary_password_validity_days = 7
  }

  # Email configuration - use Cognito default for simplicity
  email_configuration {
    email_sending_account = "COGNITO_DEFAULT"
  }

  # Account recovery via email
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  # Schema attributes
  schema {
    name                     = "email"
    attribute_data_type      = "String"
    required                 = true
    mutable                  = true
    string_attribute_constraints {
      min_length = 1
      max_length = 255
    }
  }

  schema {
    name                     = "name"
    attribute_data_type      = "String"
    required                 = false
    mutable                  = true
    string_attribute_constraints {
      min_length = 0
      max_length = 255
    }
  }

  # User pool add-ons - advanced security for production
  user_pool_add_ons {
    advanced_security_mode = var.environment == "prd" ? "ENFORCED" : "OFF"
  }

  # Deletion protection - enabled for production
  deletion_protection = var.environment == "prd" ? "ACTIVE" : "INACTIVE"

  tags = {
    Name        = "${var.project}-${var.environment}-user-pool"
    Project     = var.project
    Environment = var.environment
  }
}

# ===================
# Hosted UI Domain
# ===================

resource "aws_cognito_user_pool_domain" "main" {
  domain       = "${var.project}-${var.environment}"
  user_pool_id = aws_cognito_user_pool.main.id
}

# ===================
# Google Identity Provider
# ===================

resource "aws_cognito_identity_provider" "google" {
  count = var.google_client_id != null ? 1 : 0

  user_pool_id  = aws_cognito_user_pool.main.id
  provider_name = "Google"
  provider_type = "Google"

  provider_details = {
    client_id        = var.google_client_id
    client_secret    = var.google_client_secret
    authorize_scopes = "openid email profile"
  }

  attribute_mapping = {
    email    = "email"
    username = "sub"
    name     = "name"
    picture  = "picture"
  }
}

# ===================
# SPA App Client (PKCE, no client secret)
# ===================

resource "aws_cognito_user_pool_client" "spa" {
  name         = "${var.project}-${var.environment}-spa-client"
  user_pool_id = aws_cognito_user_pool.main.id

  # No client secret for public SPA clients (PKCE flow)
  generate_secret = false

  # OAuth settings
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["openid", "email", "profile"]

  # Callback and logout URLs
  callback_urls = var.callback_urls
  logout_urls   = var.logout_urls

  # Supported identity providers
  supported_identity_providers = var.google_client_id != null ? ["COGNITO", "Google"] : ["COGNITO"]

  # Token validity
  access_token_validity  = var.access_token_validity_hours
  id_token_validity      = var.id_token_validity_hours
  refresh_token_validity = var.refresh_token_validity_days

  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }

  # Prevent user existence errors (security best practice)
  prevent_user_existence_errors = "ENABLED"

  # Read/write attributes
  read_attributes  = ["email", "name", "picture", "email_verified"]
  write_attributes = ["email", "name", "picture"]

  # Explicit auth flows for PKCE
  explicit_auth_flows = [
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
  ]

  depends_on = [aws_cognito_identity_provider.google]
}
