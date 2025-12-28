# Route53 Module
# Creates DNS records for the application

# Data source for existing hosted zone (assumed to be pre-created)
data "aws_route53_zone" "main" {
  count = var.create_hosted_zone ? 0 : 1

  name         = var.domain_name
  private_zone = false
}

# Create hosted zone if not exists
resource "aws_route53_zone" "main" {
  count = var.create_hosted_zone ? 1 : 0

  name    = var.domain_name
  comment = "${var.project} ${var.environment} hosted zone"

  tags = {
    Name        = "${var.project}-${var.environment}-zone"
    Project     = var.project
    Environment = var.environment
  }
}

locals {
  zone_id = var.create_hosted_zone ? aws_route53_zone.main[0].zone_id : data.aws_route53_zone.main[0].zone_id
}

# CloudFront alias record (root domain)
resource "aws_route53_record" "cloudfront" {
  count = var.cloudfront_domain_name != null ? 1 : 0

  zone_id = local.zone_id
  name    = var.subdomain != "" ? "${var.subdomain}.${var.domain_name}" : var.domain_name
  type    = "A"

  alias {
    name                   = var.cloudfront_domain_name
    zone_id                = var.cloudfront_hosted_zone_id
    evaluate_target_health = false
  }
}

# CloudFront alias record (www subdomain)
resource "aws_route53_record" "cloudfront_www" {
  count = var.cloudfront_domain_name != null && var.create_www_record && var.subdomain == "" ? 1 : 0

  zone_id = local.zone_id
  name    = "www.${var.domain_name}"
  type    = "A"

  alias {
    name                   = var.cloudfront_domain_name
    zone_id                = var.cloudfront_hosted_zone_id
    evaluate_target_health = false
  }
}

# API Gateway custom domain record
resource "aws_route53_record" "api_gateway" {
  count = var.api_gateway_domain_name != null ? 1 : 0

  zone_id = local.zone_id
  name    = var.api_subdomain != "" ? "${var.api_subdomain}.${var.domain_name}" : "api.${var.domain_name}"
  type    = "A"

  alias {
    name                   = var.api_gateway_domain_name
    zone_id                = var.api_gateway_hosted_zone_id
    evaluate_target_health = true
  }
}
