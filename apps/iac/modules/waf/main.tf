# WAF Module
# Creates WAF Web ACL for CloudFront protection

# WAF Web ACL (must be in us-east-1 for CloudFront)
resource "aws_wafv2_web_acl" "main" {
  provider = aws.us_east_1

  name        = "${var.project}-${var.environment}-waf"
  description = "WAF Web ACL for ${var.project} ${var.environment}"
  scope       = "CLOUDFRONT"

  default_action {
    allow {}
  }

  # AWS Managed Rules - Common Rule Set
  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"

        dynamic "rule_action_override" {
          for_each = var.common_rules_excluded
          content {
            action_to_use {
              count {}
            }
            name = rule_action_override.value
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project}-${var.environment}-common-rules"
      sampled_requests_enabled   = true
    }
  }

  # AWS Managed Rules - Known Bad Inputs
  rule {
    name     = "AWSManagedRulesKnownBadInputsRuleSet"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${var.project}-${var.environment}-bad-inputs"
      sampled_requests_enabled   = true
    }
  }

  # AWS Managed Rules - SQL Injection
  dynamic "rule" {
    for_each = var.enable_sql_injection_protection ? [1] : []
    content {
      name     = "AWSManagedRulesSQLiRuleSet"
      priority = 3

      override_action {
        none {}
      }

      statement {
        managed_rule_group_statement {
          name        = "AWSManagedRulesSQLiRuleSet"
          vendor_name = "AWS"
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = "${var.project}-${var.environment}-sqli"
        sampled_requests_enabled   = true
      }
    }
  }

  # AWS Managed Rules - Linux OS
  dynamic "rule" {
    for_each = var.enable_linux_protection ? [1] : []
    content {
      name     = "AWSManagedRulesLinuxRuleSet"
      priority = 4

      override_action {
        none {}
      }

      statement {
        managed_rule_group_statement {
          name        = "AWSManagedRulesLinuxRuleSet"
          vendor_name = "AWS"
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = "${var.project}-${var.environment}-linux"
        sampled_requests_enabled   = true
      }
    }
  }

  # Rate Limiting Rule
  dynamic "rule" {
    for_each = var.enable_rate_limiting ? [1] : []
    content {
      name     = "RateLimitRule"
      priority = 10

      action {
        block {}
      }

      statement {
        rate_based_statement {
          limit              = var.rate_limit
          aggregate_key_type = "IP"
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = "${var.project}-${var.environment}-rate-limit"
        sampled_requests_enabled   = true
      }
    }
  }

  # Geo Restriction Rule
  dynamic "rule" {
    for_each = length(var.blocked_countries) > 0 ? [1] : []
    content {
      name     = "GeoBlockRule"
      priority = 20

      action {
        block {}
      }

      statement {
        geo_match_statement {
          country_codes = var.blocked_countries
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = "${var.project}-${var.environment}-geo-block"
        sampled_requests_enabled   = true
      }
    }
  }

  # IP Block List Rule
  dynamic "rule" {
    for_each = var.ip_block_list_arn != null ? [1] : []
    content {
      name     = "IPBlockListRule"
      priority = 30

      action {
        block {}
      }

      statement {
        ip_set_reference_statement {
          arn = var.ip_block_list_arn
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        metric_name                = "${var.project}-${var.environment}-ip-block"
        sampled_requests_enabled   = true
      }
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${var.project}-${var.environment}-waf"
    sampled_requests_enabled   = true
  }

  tags = {
    Name        = "${var.project}-${var.environment}-waf"
    Project     = var.project
    Environment = var.environment
  }
}

# CloudWatch Log Group for WAF
resource "aws_cloudwatch_log_group" "waf" {
  provider = aws.us_east_1

  name              = "aws-waf-logs-${var.project}-${var.environment}"
  retention_in_days = var.log_retention_days

  tags = {
    Name        = "${var.project}-${var.environment}-waf-logs"
    Project     = var.project
    Environment = var.environment
  }
}

# WAF Logging Configuration
resource "aws_wafv2_web_acl_logging_configuration" "main" {
  provider = aws.us_east_1

  log_destination_configs = [aws_cloudwatch_log_group.waf.arn]
  resource_arn            = aws_wafv2_web_acl.main.arn

  dynamic "redacted_fields" {
    for_each = var.redacted_fields
    content {
      dynamic "single_header" {
        for_each = redacted_fields.value.type == "header" ? [1] : []
        content {
          name = redacted_fields.value.name
        }
      }
      dynamic "query_string" {
        for_each = redacted_fields.value.type == "query_string" ? [1] : []
        content {}
      }
      dynamic "uri_path" {
        for_each = redacted_fields.value.type == "uri_path" ? [1] : []
        content {}
      }
    }
  }
}

# IP Set for block list (optional)
resource "aws_wafv2_ip_set" "block_list" {
  count    = length(var.blocked_ip_addresses) > 0 ? 1 : 0
  provider = aws.us_east_1

  name               = "${var.project}-${var.environment}-ip-block-list"
  description        = "IP addresses to block"
  scope              = "CLOUDFRONT"
  ip_address_version = "IPV4"
  addresses          = var.blocked_ip_addresses

  tags = {
    Name        = "${var.project}-${var.environment}-ip-block-list"
    Project     = var.project
    Environment = var.environment
  }
}
