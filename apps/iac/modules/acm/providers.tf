# ACM module requires us-east-1 provider for CloudFront certificates
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
