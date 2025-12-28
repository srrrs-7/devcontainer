# WAF module requires us-east-1 provider for CloudFront Web ACL
# This provider must be passed from the root module

terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = ">= 5.0"
      configuration_aliases = [aws.us_east_1]
    }
  }
}
