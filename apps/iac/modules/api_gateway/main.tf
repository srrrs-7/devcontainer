# API Gateway Module
# Creates HTTP API with VPC Link to connect to private NLB

# VPC Link for API Gateway
resource "aws_apigatewayv2_vpc_link" "main" {
  name               = "${var.project}-${var.environment}-vpc-link"
  security_group_ids = var.security_group_ids
  subnet_ids         = var.subnet_ids

  tags = {
    Name        = "${var.project}-${var.environment}-vpc-link"
    Project     = var.project
    Environment = var.environment
  }
}

# HTTP API
resource "aws_apigatewayv2_api" "main" {
  name          = "${var.project}-${var.environment}-api"
  protocol_type = "HTTP"
  description   = "${var.project} ${var.environment} HTTP API"

  cors_configuration {
    allow_credentials = var.cors_allow_credentials
    allow_headers     = var.cors_allow_headers
    allow_methods     = var.cors_allow_methods
    allow_origins     = var.cors_allow_origins
    expose_headers    = var.cors_expose_headers
    max_age           = var.cors_max_age
  }

  tags = {
    Name        = "${var.project}-${var.environment}-api"
    Project     = var.project
    Environment = var.environment
  }
}

# VPC Link Integration
resource "aws_apigatewayv2_integration" "nlb" {
  api_id             = aws_apigatewayv2_api.main.id
  integration_type   = "HTTP_PROXY"
  integration_uri    = var.nlb_listener_arn
  integration_method = "ANY"
  connection_type    = "VPC_LINK"
  connection_id      = aws_apigatewayv2_vpc_link.main.id

  request_parameters = {
    "overwrite:path" = "$request.path"
  }
}

# Default Route (proxy all requests)
resource "aws_apigatewayv2_route" "default" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "$default"
  target    = "integrations/${aws_apigatewayv2_integration.nlb.id}"
}

# API Stage
resource "aws_apigatewayv2_stage" "main" {
  api_id      = aws_apigatewayv2_api.main.id
  name        = "$default"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gateway.arn
    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      integrationLatency      = "$context.integrationLatency"
      responseLatency         = "$context.responseLatency"
    })
  }

  default_route_settings {
    throttling_burst_limit = var.throttling_burst_limit
    throttling_rate_limit  = var.throttling_rate_limit
  }

  tags = {
    Name        = "${var.project}-${var.environment}-api-stage"
    Project     = var.project
    Environment = var.environment
  }
}

# CloudWatch Log Group for API Gateway
resource "aws_cloudwatch_log_group" "api_gateway" {
  name              = "/aws/api-gateway/${var.project}-${var.environment}"
  retention_in_days = var.log_retention_days

  tags = {
    Name        = "${var.project}-${var.environment}-api-gateway-logs"
    Project     = var.project
    Environment = var.environment
  }
}

# Custom Domain (optional)
resource "aws_apigatewayv2_domain_name" "main" {
  count = var.domain_name != null ? 1 : 0

  domain_name = var.domain_name

  domain_name_configuration {
    certificate_arn = var.certificate_arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }

  tags = {
    Name        = "${var.project}-${var.environment}-api-domain"
    Project     = var.project
    Environment = var.environment
  }
}

# API Mapping for Custom Domain
resource "aws_apigatewayv2_api_mapping" "main" {
  count = var.domain_name != null ? 1 : 0

  api_id          = aws_apigatewayv2_api.main.id
  domain_name     = aws_apigatewayv2_domain_name.main[0].id
  stage           = aws_apigatewayv2_stage.main.id
  api_mapping_key = var.api_mapping_key
}
