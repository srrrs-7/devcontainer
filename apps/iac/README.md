# Infrastructure as Code (Terraform)

AWS infrastructure for the play-devcontainer project.

## Table of Contents

- [Architecture](#architecture)
- [Directory Structure](#directory-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Detailed Setup Guide](#detailed-setup-guide)
  - [1. AWS Account Setup](#1-aws-account-setup)
  - [2. Route53 Domain Setup](#2-route53-domain-setup)
  - [3. Terraform Backend Setup](#3-terraform-backend-setup)
  - [4. Environment Variables Configuration](#4-environment-variables-configuration)
  - [5. Deploy Infrastructure](#5-deploy-infrastructure)
- [Module Reference](#module-reference)
- [Environment Differences](#environment-differences)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)
- [Cost Estimation](#cost-estimation)

## Architecture

```
                                    ┌─────────────────────────────────────────────────────────────┐
                                    │                         AWS Cloud                            │
                                    │                                                              │
┌──────────┐     ┌─────────┐       │  ┌──────────┐    ┌─────────────────────────────────────┐    │
│          │     │         │       │  │   WAF    │    │            CloudFront                │    │
│  Users   │────▶│  Route  │───────┼─▶│          │───▶│                                     │    │
│          │     │   53    │       │  │          │    │  ┌─────────────────────────────┐    │    │
└──────────┘     └─────────┘       │  └──────────┘    │  │      Cache Behaviors        │    │    │
                                    │                  │  │                             │    │    │
                                    │                  │  │  Default (/*) ──▶ S3        │    │    │
                                    │                  │  │  /api/*     ──▶ API GW      │    │    │
                                    │                  │  └─────────────────────────────┘    │    │
                                    │                  └───────┬─────────────────┬───────────┘    │
                                    │                          │                 │                 │
                                    │                          ▼                 ▼                 │
                                    │                   ┌──────────┐      ┌──────────────┐        │
                                    │                   │    S3    │      │ API Gateway  │        │
                                    │                   │  (SPA)   │      │ (HTTP API)   │        │
                                    │                   └──────────┘      └──────┬───────┘        │
                                    │                                            │                 │
                                    │                                     ┌──────┴───────┐        │
                                    │                                     │  VPC Link    │        │
                                    │  ┌──────────────────────────────────┴──────────────┴─────┐  │
                                    │  │                         VPC                            │  │
                                    │  │                                                        │  │
                                    │  │  ┌─────────────────────────────────────────────────┐  │  │
                                    │  │  │              Public Subnets                      │  │  │
                                    │  │  │  ┌─────────────┐    ┌─────────────┐             │  │  │
                                    │  │  │  │ NAT Gateway │    │ NAT Gateway │             │  │  │
                                    │  │  │  │   (AZ-a)    │    │   (AZ-c)    │             │  │  │
                                    │  │  │  └─────────────┘    └─────────────┘             │  │  │
                                    │  │  └─────────────────────────────────────────────────┘  │  │
                                    │  │                                                        │  │
                                    │  │  ┌─────────────────────────────────────────────────┐  │  │
                                    │  │  │              Private Subnets                     │  │  │
                                    │  │  │                                                  │  │  │
                                    │  │  │  ┌─────────────┐    ┌─────────────────────────┐ │  │  │
                                    │  │  │  │     NLB     │───▶│      ECS Fargate        │ │  │  │
                                    │  │  │  └─────────────┘    │  ┌───────┐  ┌───────┐   │ │  │  │
                                    │  │  │                     │  │ Task  │  │ Task  │   │ │  │  │
                                    │  │  │                     │  └───────┘  └───────┘   │ │  │  │
                                    │  │  │                     └─────────────────────────┘ │  │  │
                                    │  │  │                                                  │  │  │
                                    │  │  │  ┌─────────────────────────────────────────────┐│  │  │
                                    │  │  │  │         Aurora Serverless v2                ││  │  │
                                    │  │  │  │  ┌──────────┐         ┌──────────┐          ││  │  │
                                    │  │  │  │  │  Writer  │         │  Reader  │          ││  │  │
                                    │  │  │  │  │ Instance │         │ Instance │          ││  │  │
                                    │  │  │  │  └──────────┘         └──────────┘          ││  │  │
                                    │  │  │  └─────────────────────────────────────────────┘│  │  │
                                    │  │  └─────────────────────────────────────────────────┘  │  │
                                    │  └────────────────────────────────────────────────────────┘  │
                                    │                                                              │
                                    │  ┌──────────┐                                                │
                                    │  │   ECR    │  Container Registry                            │
                                    │  └──────────┘                                                │
                                    └──────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **User** → Route53 (DNS resolution)
2. **Route53** → CloudFront (HTTPS)
3. **CloudFront** → WAF (Security filtering)
4. **WAF** → CloudFront Cache Behaviors:
   - `/*` (default) → S3 (SPA static files)
   - `/api/*` → API Gateway HTTP API
5. **API Gateway** → VPC Link → NLB (private)
6. **NLB** → ECS Fargate Tasks (private subnet)
7. **ECS Tasks** → Aurora Serverless v2 (database subnet)

## Directory Structure

```
apps/iac/
├── modules/
│   ├── vpc/              # VPC, Subnets, NAT Gateway, Internet Gateway
│   ├── s3_cloudfront/    # S3 bucket + CloudFront distribution
│   ├── acm/              # SSL/TLS certificates
│   ├── route53/          # DNS records
│   ├── ecr/              # Container registry
│   ├── ecs/              # ECS cluster, service, task definition, NLB
│   ├── api_gateway/      # API Gateway HTTP API + VPC Link
│   ├── aurora/           # Aurora Serverless v2
│   └── waf/              # WAF Web ACL
├── environments/
│   ├── dev/              # Development environment
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── terraform.tfvars.example
│   └── prd/              # Production environment
│       ├── main.tf
│       ├── variables.tf
│       ├── outputs.tf
│       └── terraform.tfvars.example
└── README.md
```

## Prerequisites

Before starting, ensure you have:

1. **AWS CLI** v2 installed and configured
2. **Terraform** >= 1.9.0 installed
3. **AWS Account** with appropriate permissions
4. **Registered domain name** (can be registered via Route53 or external registrar)

### Required AWS Permissions

The IAM user/role needs permissions for:
- VPC, EC2, ECS, ECR
- S3, CloudFront
- Route53, ACM
- API Gateway
- RDS (Aurora)
- WAF v2
- IAM (for service roles)
- Secrets Manager
- CloudWatch Logs

## Quick Start

```bash
# 1. Navigate to environment directory
cd apps/iac/environments/dev

# 2. Copy example tfvars
cp terraform.tfvars.example terraform.tfvars

# 3. Edit terraform.tfvars with your values
vim terraform.tfvars

# 4. Initialize Terraform
terraform init

# 5. Review planned changes
terraform plan

# 6. Apply infrastructure
terraform apply
```

## Detailed Setup Guide

### 1. AWS Account Setup

#### 1.1 AWS SSO Login (Recommended)

AWS IAM Identity Center (旧 AWS SSO) を使用した認証：

```bash
# SSO セッションの設定（初回のみ）
aws configure sso
# SSO session name: my-sso
# SSO start URL: https://your-org.awsapps.com/start
# SSO region: ap-northeast-1
# SSO registration scopes: sso:account:access

# ログイン
aws sso login --profile <profile-name>

# または、デフォルトプロファイルを使用
aws sso login
```

#### 1.2 AWS CLI Profile Configuration

`~/.aws/config` の設定例：

```ini
[profile dev]
sso_session = my-sso
sso_account_id = 123456789012
sso_role_name = AdministratorAccess
region = ap-northeast-1
output = json

[profile prd]
sso_session = my-sso
sso_account_id = 987654321098
sso_role_name = AdministratorAccess
region = ap-northeast-1
output = json

[sso-session my-sso]
sso_start_url = https://your-org.awsapps.com/start
sso_region = ap-northeast-1
sso_registration_scopes = sso:account:access
```

#### 1.3 Terraform with AWS Profile

```bash
# 環境変数でプロファイルを指定
export AWS_PROFILE=dev

# または Terraform 実行時に指定
AWS_PROFILE=dev terraform plan
AWS_PROFILE=dev terraform apply
```

#### 1.4 Create IAM Role for GitHub Actions (CI/CD)

Create a trust policy file `github-actions-trust-policy.json`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:<GITHUB_ORG>/<REPO_NAME>:*"
        }
      }
    }
  ]
}
```

```bash
# Create OIDC provider (one-time setup)
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1

# Create role for dev environment
aws iam create-role \
  --role-name github-actions-deploy-dev \
  --assume-role-policy-document file://github-actions-trust-policy.json

# Attach necessary policies
aws iam attach-role-policy \
  --role-name github-actions-deploy-dev \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

### 2. Route53 Domain Setup

#### 2.1 Option A: Register Domain via Route53

```bash
# Check domain availability
aws route53domains check-domain-availability \
  --domain-name example.com

# Register domain (interactive process)
aws route53domains register-domain \
  --domain-name example.com \
  --duration-in-years 1 \
  --admin-contact file://contact.json \
  --registrant-contact file://contact.json \
  --tech-contact file://contact.json
```

#### 2.2 Option B: Use External Domain with Route53 Hosted Zone

If your domain is registered with an external registrar:

```bash
# 1. Create hosted zone in Route53
aws route53 create-hosted-zone \
  --name example.com \
  --caller-reference "$(date +%s)"

# 2. Get the name servers
aws route53 get-hosted-zone --id <HOSTED_ZONE_ID> \
  --query 'DelegationSet.NameServers'

# Output example:
# [
#   "ns-123.awsdns-45.com",
#   "ns-678.awsdns-90.net",
#   "ns-111.awsdns-22.org",
#   "ns-333.awsdns-44.co.uk"
# ]

# 3. Update your domain registrar's NS records to point to these name servers
```

#### 2.3 Verify Hosted Zone

```bash
# List hosted zones
aws route53 list-hosted-zones

# Get hosted zone ID for your domain
aws route53 list-hosted-zones-by-name \
  --dns-name example.com \
  --query 'HostedZones[0].Id'
```

#### 2.4 Domain Configuration Examples

**Single Domain (Production)**:
```hcl
domain_name     = "example.com"      # Root domain with hosted zone
app_domain_name = "example.com"      # Application URL
```

**Subdomain (Development)**:
```hcl
domain_name     = "example.com"      # Root domain with hosted zone
app_domain_name = "dev.example.com"  # Development subdomain
```

**Separate Domain per Environment**:
```hcl
# Dev
domain_name     = "example.com"
app_domain_name = "dev.example.com"

# Production
domain_name     = "example.com"
app_domain_name = "app.example.com"
```

### 3. Terraform Backend Setup

For team collaboration and state management, use S3 backend with DynamoDB locking.

#### 3.1 Create S3 Bucket for State

```bash
# Create bucket
aws s3api create-bucket \
  --bucket my-terraform-state-bucket \
  --region ap-northeast-1 \
  --create-bucket-configuration LocationConstraint=ap-northeast-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket my-terraform-state-bucket \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket my-terraform-state-bucket \
  --server-side-encryption-configuration '{
    "Rules": [
      {
        "ApplyServerSideEncryptionByDefault": {
          "SSEAlgorithm": "AES256"
        }
      }
    ]
  }'

# Block public access
aws s3api put-public-access-block \
  --bucket my-terraform-state-bucket \
  --public-access-block-configuration '{
    "BlockPublicAcls": true,
    "IgnorePublicAcls": true,
    "BlockPublicPolicy": true,
    "RestrictPublicBuckets": true
  }'
```

#### 3.2 Create DynamoDB Table for State Locking

```bash
aws dynamodb create-table \
  --table-name terraform-state-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region ap-northeast-1
```

#### 3.3 Configure Backend in main.tf

Uncomment and configure the backend block in `environments/dev/main.tf` or `environments/prd/main.tf`:

```hcl
terraform {
  backend "s3" {
    bucket         = "my-terraform-state-bucket"
    key            = "play-devcontainer/dev/terraform.tfstate"  # or prd
    region         = "ap-northeast-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}
```

### 4. Environment Variables Configuration

#### 4.1 Create terraform.tfvars

```bash
cd apps/iac/environments/dev
cp terraform.tfvars.example terraform.tfvars
```

#### 4.2 Configure Variables

Edit `terraform.tfvars`:

```hcl
# ===================
# Basic Configuration
# ===================
project     = "play-devcontainer"
environment = "dev"
aws_region  = "ap-northeast-1"

# ===================
# Network Configuration
# ===================
vpc_cidr = "10.0.0.0/16"  # Use 10.1.0.0/16 for prd to avoid overlap

# ===================
# Domain Configuration
# ===================
# Root domain - must have existing Route53 hosted zone
domain_name = "example.com"

# Application domain - where users access the app
# Examples:
#   - "dev.example.com" (subdomain for dev)
#   - "example.com" (root domain for production)
#   - "app.example.com" (subdomain for production)
app_domain_name = "dev.example.com"

# ===================
# Database Configuration
# ===================
db_name     = "app"
db_username = "admin"
# Use a strong password! Example: openssl rand -base64 32
db_password = "YourSecurePassword123!"
```

#### 4.3 Variable Reference

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `project` | Yes | Project identifier (used in resource naming) | `play-devcontainer` |
| `environment` | Yes | Environment name | `dev` or `prd` |
| `aws_region` | Yes | AWS region for resources | `ap-northeast-1` |
| `vpc_cidr` | Yes | VPC CIDR block | `10.0.0.0/16` |
| `domain_name` | Yes | Root domain with Route53 hosted zone | `example.com` |
| `app_domain_name` | Yes | Application URL domain | `dev.example.com` |
| `db_name` | Yes | Database name | `app` |
| `db_username` | Yes | Database master username | `admin` |
| `db_password` | Yes | Database master password | (secure string) |

### 5. Deploy Infrastructure

#### 5.1 Initialize Terraform

```bash
cd apps/iac/environments/dev

# Initialize with backend
terraform init

# If using local state (no backend configured)
terraform init
```

#### 5.2 Validate Configuration

```bash
terraform validate
```

#### 5.3 Plan Changes

```bash
terraform plan -out=tfplan

# Review the plan carefully!
```

#### 5.4 Apply Infrastructure

```bash
# Apply with plan file
terraform apply tfplan

# Or apply directly (will prompt for confirmation)
terraform apply
```

#### 5.5 Deployment Order (First Time)

The modules have proper dependencies, but the first deployment may take 15-30 minutes:

1. VPC & Subnets (~2 min)
2. ECR (~1 min)
3. Aurora Cluster (~10-15 min)
4. ECS Cluster & Service (~5 min)
5. API Gateway & VPC Link (~2 min)
6. ACM Certificates (~5 min for validation)
7. CloudFront (~5-10 min)
8. Route53 Records (~1 min)
9. WAF (~2 min)

#### 5.6 Get Outputs

```bash
terraform output

# Specific outputs
terraform output app_url
terraform output ecr_repository_url
terraform output aurora_cluster_endpoint
```

## Module Reference

### VPC Module

Creates network infrastructure with public, private, and database subnets.

| Variable | Default | Description |
|----------|---------|-------------|
| `vpc_cidr` | `10.0.0.0/16` | VPC CIDR block |
| `az_count` | `2` | Number of availability zones |
| `enable_nat_gateway` | `true` | Enable NAT Gateway |
| `single_nat_gateway` | `false` | Use single NAT (cost saving) |
| `enable_flow_logs` | `false` | Enable VPC Flow Logs |

### ECS Module

Creates ECS Fargate cluster with auto-scaling.

| Variable | Default | Description |
|----------|---------|-------------|
| `task_cpu` | `256` | Task CPU units |
| `task_memory` | `512` | Task memory (MB) |
| `desired_count` | `2` | Desired task count |
| `enable_autoscaling` | `true` | Enable auto-scaling |
| `min_capacity` | `2` | Minimum tasks |
| `max_capacity` | `10` | Maximum tasks |

### Aurora Module

Creates Aurora Serverless v2 PostgreSQL cluster.

| Variable | Default | Description |
|----------|---------|-------------|
| `engine_version` | `16.4` | PostgreSQL version |
| `min_capacity` | `0.5` | Minimum ACU |
| `max_capacity` | `16` | Maximum ACU |
| `backup_retention_period` | `7` | Backup retention (days) |
| `deletion_protection` | `true` | Prevent accidental deletion |

### WAF Module

Creates WAF Web ACL with managed rules.

| Variable | Default | Description |
|----------|---------|-------------|
| `enable_sql_injection_protection` | `true` | SQLi protection |
| `enable_rate_limiting` | `true` | Rate limiting |
| `rate_limit` | `2000` | Requests per 5 min per IP |

## Environment Differences

| Feature | Development | Production |
|---------|-------------|------------|
| NAT Gateway | Single (1 AZ) | Multi-AZ (2) |
| ECS Tasks | 1 (no autoscaling) | 2+ (autoscaling) |
| ECS Capacity | Fargate Spot | Standard Fargate |
| Aurora ACU | 0.5-2 | 0.5-16 |
| Aurora Reader | No | Yes |
| Deletion Protection | No | Yes |
| VPC Flow Logs | No | Yes |
| Log Retention | 7 days | 90 days |
| S3 Versioning | No | Yes |
| Container Insights | No | Yes |

## CI/CD Integration

### GitHub Actions Configuration

#### Required Secrets

| Secret | Description |
|--------|-------------|
| `AWS_ROLE_ARN_DEV` | IAM role ARN for dev deployment |
| `AWS_ROLE_ARN_PRD` | IAM role ARN for prd deployment |

#### Required Variables (per environment)

| Variable | Description | Example |
|----------|-------------|---------|
| `S3_BUCKET_NAME` | SPA S3 bucket name | `play-devcontainer-dev-spa-123456789` |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution ID | `E1ABCDEF123456` |
| `ECR_REPOSITORY_NAME` | ECR repository name | `play-devcontainer-dev-api` |
| `ECS_CLUSTER_NAME` | ECS cluster name | `play-devcontainer-dev-cluster` |
| `ECS_SERVICE_NAME` | ECS service name | `play-devcontainer-dev-api` |
| `API_URL` | API Gateway URL | `https://api.dev.example.com` |

#### Get Values from Terraform Output

```bash
# After terraform apply, get values for GitHub variables
terraform output -json | jq '{
  S3_BUCKET_NAME: .s3_bucket_id.value,
  CLOUDFRONT_DISTRIBUTION_ID: .cloudfront_distribution_id.value,
  ECR_REPOSITORY_NAME: .ecr_repository_url.value | split("/") | last,
  ECS_CLUSTER_NAME: .ecs_cluster_name.value,
  ECS_SERVICE_NAME: .ecs_service_name.value,
  API_URL: .api_gateway_endpoint.value
}'
```

## Troubleshooting

### Common Issues

#### 1. ACM Certificate Validation Timeout

**Symptom**: Certificate stays in "Pending validation" state

**Solution**:
```bash
# Check DNS propagation
dig _acme-challenge.dev.example.com CNAME

# Ensure Route53 hosted zone is properly configured
aws route53 list-resource-record-sets --hosted-zone-id <ZONE_ID>
```

#### 2. ECS Service Not Starting

**Symptom**: Tasks fail to start or keep restarting

**Solution**:
```bash
# Check task logs
aws logs tail /ecs/play-devcontainer-dev/api --follow

# Check service events
aws ecs describe-services \
  --cluster play-devcontainer-dev-cluster \
  --services play-devcontainer-dev-api \
  --query 'services[0].events[:5]'
```

#### 3. Aurora Connection Issues

**Symptom**: ECS tasks can't connect to database

**Solution**:
```bash
# Verify security group rules
aws ec2 describe-security-groups \
  --group-ids <AURORA_SG_ID> \
  --query 'SecurityGroups[0].IpPermissions'

# Check if ECS security group is allowed
```

#### 4. CloudFront 403 Error

**Symptom**: Access denied when accessing the application

**Solution**:
```bash
# Check S3 bucket policy
aws s3api get-bucket-policy --bucket <BUCKET_NAME>

# Verify OAC is properly configured
aws cloudfront get-distribution --id <DISTRIBUTION_ID> \
  --query 'Distribution.DistributionConfig.Origins'
```

### Useful Commands

```bash
# View all resources in a module
terraform state list | grep module.vpc

# Import existing resource
terraform import module.vpc.aws_vpc.main vpc-12345678

# Taint resource for recreation
terraform taint module.ecs.aws_ecs_service.api

# Remove resource from state (without destroying)
terraform state rm module.ecr.aws_ecr_repository.api
```

## Cost Estimation

### Development Environment (Monthly)

| Service | Estimated Cost |
|---------|---------------|
| NAT Gateway (1x) | ~$32 |
| Aurora Serverless v2 (0.5 ACU avg) | ~$43 |
| ECS Fargate Spot | ~$10 |
| CloudFront | ~$1 |
| Route53 | ~$0.50 |
| S3 | ~$1 |
| API Gateway | ~$1 |
| **Total** | **~$90/month** |

### Production Environment (Monthly)

| Service | Estimated Cost |
|---------|---------------|
| NAT Gateway (2x) | ~$64 |
| Aurora Serverless v2 (2 ACU avg) | ~$170 |
| ECS Fargate (2 tasks) | ~$60 |
| CloudFront | ~$10 |
| Route53 | ~$0.50 |
| S3 | ~$5 |
| WAF | ~$5 |
| API Gateway | ~$5 |
| **Total** | **~$320/month** |

*Costs vary based on usage. Use AWS Cost Explorer for accurate estimates.*

## Destroying Infrastructure

```bash
# CAUTION: This will destroy all resources!

cd apps/iac/environments/dev

# Plan destruction
terraform plan -destroy

# Destroy (requires confirmation)
terraform destroy
```

**Important**: Before destroying production:
1. Take database snapshots
2. Download CloudFront logs
3. Backup any important data in S3
