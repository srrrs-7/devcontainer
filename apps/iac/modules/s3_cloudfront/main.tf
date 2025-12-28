# S3 + CloudFront Module
# Creates S3 bucket for SPA hosting with CloudFront distribution

locals {
  s3_origin_id      = "S3-${var.project}-${var.environment}"
  api_origin_id     = "API-${var.project}-${var.environment}"
}

# S3 Bucket for SPA
resource "aws_s3_bucket" "spa" {
  bucket = "${var.project}-${var.environment}-spa-${var.aws_account_id}"

  tags = {
    Name        = "${var.project}-${var.environment}-spa"
    Project     = var.project
    Environment = var.environment
  }
}

# S3 Bucket Versioning
resource "aws_s3_bucket_versioning" "spa" {
  bucket = aws_s3_bucket.spa.id

  versioning_configuration {
    status = var.enable_versioning ? "Enabled" : "Disabled"
  }
}

# S3 Bucket Server-side Encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "spa" {
  bucket = aws_s3_bucket.spa.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# S3 Bucket Public Access Block
resource "aws_s3_bucket_public_access_block" "spa" {
  bucket = aws_s3_bucket.spa.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Bucket Policy for CloudFront OAC
resource "aws_s3_bucket_policy" "spa" {
  bucket = aws_s3_bucket.spa.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudFrontServicePrincipal"
        Effect = "Allow"
        Principal = {
          Service = "cloudfront.amazonaws.com"
        }
        Action   = "s3:GetObject"
        Resource = "${aws_s3_bucket.spa.arn}/*"
        Condition = {
          StringEquals = {
            "AWS:SourceArn" = aws_cloudfront_distribution.main.arn
          }
        }
      }
    ]
  })

  depends_on = [aws_cloudfront_distribution.main]
}

# CloudFront Origin Access Control
resource "aws_cloudfront_origin_access_control" "spa" {
  name                              = "${var.project}-${var.environment}-spa-oac"
  description                       = "OAC for ${var.project} ${var.environment} SPA"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# CloudFront Cache Policy for SPA
resource "aws_cloudfront_cache_policy" "spa" {
  name        = "${var.project}-${var.environment}-spa-cache-policy"
  comment     = "Cache policy for SPA static assets"
  default_ttl = 86400    # 1 day
  max_ttl     = 31536000 # 1 year
  min_ttl     = 0

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "none"
    }
    query_strings_config {
      query_string_behavior = "none"
    }
    enable_accept_encoding_brotli = true
    enable_accept_encoding_gzip   = true
  }
}

# CloudFront Response Headers Policy
resource "aws_cloudfront_response_headers_policy" "spa" {
  name    = "${var.project}-${var.environment}-spa-headers-policy"
  comment = "Security headers for SPA"

  security_headers_config {
    content_type_options {
      override = true
    }
    frame_options {
      frame_option = "DENY"
      override     = true
    }
    referrer_policy {
      referrer_policy = "strict-origin-when-cross-origin"
      override        = true
    }
    xss_protection {
      mode_block = true
      protection = true
      override   = true
    }
    strict_transport_security {
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      preload                    = true
      override                   = true
    }
  }
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "${var.project} ${var.environment} distribution"
  default_root_object = "index.html"
  price_class         = var.cloudfront_price_class
  aliases             = var.domain_names
  web_acl_id          = var.waf_web_acl_arn

  # S3 Origin (SPA)
  origin {
    domain_name              = aws_s3_bucket.spa.bucket_regional_domain_name
    origin_id                = local.s3_origin_id
    origin_access_control_id = aws_cloudfront_origin_access_control.spa.id
  }

  # API Gateway Origin
  dynamic "origin" {
    for_each = var.api_gateway_endpoint != null ? [1] : []
    content {
      domain_name = replace(var.api_gateway_endpoint, "https://", "")
      origin_id   = local.api_origin_id

      custom_origin_config {
        http_port              = 80
        https_port             = 443
        origin_protocol_policy = "https-only"
        origin_ssl_protocols   = ["TLSv1.2"]
      }
    }
  }

  # Default Cache Behavior (SPA)
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    cache_policy_id            = aws_cloudfront_cache_policy.spa.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.spa.id

    viewer_protocol_policy = "redirect-to-https"
    compress               = true

    function_association {
      event_type   = "viewer-request"
      function_arn = aws_cloudfront_function.spa_routing.arn
    }
  }

  # API Cache Behavior (/api/*)
  dynamic "ordered_cache_behavior" {
    for_each = var.api_gateway_endpoint != null ? [1] : []
    content {
      path_pattern     = "/api/*"
      allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
      cached_methods   = ["GET", "HEAD"]
      target_origin_id = local.api_origin_id

      # Disable caching for API
      cache_policy_id          = data.aws_cloudfront_cache_policy.caching_disabled.id
      origin_request_policy_id = data.aws_cloudfront_origin_request_policy.all_viewer_except_host_header.id

      viewer_protocol_policy = "redirect-to-https"
      compress               = true
    }
  }

  # Custom error response for SPA (return index.html for 403/404)
  custom_error_response {
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  custom_error_response {
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
    error_caching_min_ttl = 0
  }

  restrictions {
    geo_restriction {
      restriction_type = var.geo_restriction_type
      locations        = var.geo_restriction_locations
    }
  }

  viewer_certificate {
    acm_certificate_arn            = var.acm_certificate_arn
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2021"
    cloudfront_default_certificate = var.acm_certificate_arn == null
  }

  logging_config {
    include_cookies = false
    bucket          = var.logging_bucket != null ? var.logging_bucket : aws_s3_bucket.logs[0].bucket_domain_name
    prefix          = "cloudfront/"
  }

  tags = {
    Name        = "${var.project}-${var.environment}-distribution"
    Project     = var.project
    Environment = var.environment
  }

  depends_on = [aws_s3_bucket.logs]
}

# Managed cache policies
data "aws_cloudfront_cache_policy" "caching_disabled" {
  name = "Managed-CachingDisabled"
}

data "aws_cloudfront_origin_request_policy" "all_viewer_except_host_header" {
  name = "Managed-AllViewerExceptHostHeader"
}

# CloudFront Function for SPA routing
resource "aws_cloudfront_function" "spa_routing" {
  name    = "${var.project}-${var.environment}-spa-routing"
  runtime = "cloudfront-js-2.0"
  comment = "SPA routing - add .html extension or redirect to index.html"
  publish = true

  code = <<-EOF
    function handler(event) {
      var request = event.request;
      var uri = request.uri;

      // Check if URI is missing file extension
      if (uri.endsWith('/')) {
        request.uri += 'index.html';
      } else if (!uri.includes('.')) {
        request.uri += '/index.html';
      }

      return request;
    }
  EOF
}

# S3 Bucket for CloudFront Logs
resource "aws_s3_bucket" "logs" {
  count = var.logging_bucket == null ? 1 : 0

  bucket = "${var.project}-${var.environment}-cloudfront-logs-${var.aws_account_id}"

  tags = {
    Name        = "${var.project}-${var.environment}-cloudfront-logs"
    Project     = var.project
    Environment = var.environment
  }
}

resource "aws_s3_bucket_ownership_controls" "logs" {
  count = var.logging_bucket == null ? 1 : 0

  bucket = aws_s3_bucket.logs[0].id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "logs" {
  count = var.logging_bucket == null ? 1 : 0

  bucket = aws_s3_bucket.logs[0].id
  acl    = "private"

  depends_on = [aws_s3_bucket_ownership_controls.logs]
}

resource "aws_s3_bucket_public_access_block" "logs" {
  count = var.logging_bucket == null ? 1 : 0

  bucket = aws_s3_bucket.logs[0].id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_lifecycle_configuration" "logs" {
  count = var.logging_bucket == null ? 1 : 0

  bucket = aws_s3_bucket.logs[0].id

  rule {
    id     = "expire-logs"
    status = "Enabled"

    expiration {
      days = var.logs_retention_days
    }
  }
}
