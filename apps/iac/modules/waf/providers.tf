# WAF module - self-contained provider for CloudFront Web ACL
# CloudFront WAF must be created in us-east-1 region

terraform {
  required_version = ">= 1.9.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

# Provider for us-east-1 (required for CloudFront WAF)
provider "aws" {
  region = "us-east-1"
}
