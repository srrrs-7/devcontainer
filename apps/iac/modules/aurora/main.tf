# Aurora Serverless v2 Module
# Creates Aurora PostgreSQL Serverless v2 cluster

# DB Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "${var.project}-${var.environment}-db-subnet-group"
  subnet_ids = var.subnet_ids

  tags = {
    Name        = "${var.project}-${var.environment}-db-subnet-group"
    Project     = var.project
    Environment = var.environment
  }
}

# Security Group for Aurora
resource "aws_security_group" "aurora" {
  name        = "${var.project}-${var.environment}-aurora-sg"
  description = "Security group for Aurora cluster"
  vpc_id      = var.vpc_id

  ingress {
    description     = "PostgreSQL from ECS tasks"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = var.allowed_security_groups
  }

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "${var.project}-${var.environment}-aurora-sg"
    Project     = var.project
    Environment = var.environment
  }
}

# KMS Key for encryption
resource "aws_kms_key" "aurora" {
  count = var.create_kms_key ? 1 : 0

  description             = "KMS key for ${var.project} ${var.environment} Aurora cluster"
  deletion_window_in_days = var.kms_key_deletion_window
  enable_key_rotation     = true

  tags = {
    Name        = "${var.project}-${var.environment}-aurora-kms"
    Project     = var.project
    Environment = var.environment
  }
}

resource "aws_kms_alias" "aurora" {
  count = var.create_kms_key ? 1 : 0

  name          = "alias/${var.project}-${var.environment}-aurora"
  target_key_id = aws_kms_key.aurora[0].key_id
}

# Aurora Cluster
resource "aws_rds_cluster" "main" {
  cluster_identifier = "${var.project}-${var.environment}-cluster"

  engine         = "aurora-postgresql"
  engine_mode    = "provisioned"
  engine_version = var.engine_version

  database_name   = var.database_name
  master_username = var.master_username
  master_password = var.master_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.aurora.id]

  storage_encrypted = true
  kms_key_id        = var.create_kms_key ? aws_kms_key.aurora[0].arn : var.kms_key_arn

  serverlessv2_scaling_configuration {
    min_capacity = var.min_capacity
    max_capacity = var.max_capacity
  }

  backup_retention_period = var.backup_retention_period
  preferred_backup_window = var.preferred_backup_window

  preferred_maintenance_window = var.preferred_maintenance_window

  skip_final_snapshot       = var.skip_final_snapshot
  final_snapshot_identifier = var.skip_final_snapshot ? null : "${var.project}-${var.environment}-final-snapshot"

  deletion_protection = var.deletion_protection

  enabled_cloudwatch_logs_exports = var.enabled_cloudwatch_logs_exports

  apply_immediately = var.apply_immediately

  tags = {
    Name        = "${var.project}-${var.environment}-aurora-cluster"
    Project     = var.project
    Environment = var.environment
  }
}

# Aurora Writer Instance
resource "aws_rds_cluster_instance" "writer" {
  identifier         = "${var.project}-${var.environment}-writer"
  cluster_identifier = aws_rds_cluster.main.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.main.engine
  engine_version     = aws_rds_cluster.main.engine_version

  publicly_accessible = false

  performance_insights_enabled          = var.performance_insights_enabled
  performance_insights_retention_period = var.performance_insights_retention_period

  monitoring_interval = var.enhanced_monitoring_interval
  monitoring_role_arn = var.enhanced_monitoring_interval > 0 ? aws_iam_role.rds_monitoring[0].arn : null

  tags = {
    Name        = "${var.project}-${var.environment}-aurora-writer"
    Project     = var.project
    Environment = var.environment
  }
}

# Aurora Reader Instance (optional)
resource "aws_rds_cluster_instance" "reader" {
  count = var.create_reader_instance ? 1 : 0

  identifier         = "${var.project}-${var.environment}-reader"
  cluster_identifier = aws_rds_cluster.main.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.main.engine
  engine_version     = aws_rds_cluster.main.engine_version

  publicly_accessible = false

  performance_insights_enabled          = var.performance_insights_enabled
  performance_insights_retention_period = var.performance_insights_retention_period

  monitoring_interval = var.enhanced_monitoring_interval
  monitoring_role_arn = var.enhanced_monitoring_interval > 0 ? aws_iam_role.rds_monitoring[0].arn : null

  tags = {
    Name        = "${var.project}-${var.environment}-aurora-reader"
    Project     = var.project
    Environment = var.environment
  }

  depends_on = [aws_rds_cluster_instance.writer]
}

# Enhanced Monitoring IAM Role
resource "aws_iam_role" "rds_monitoring" {
  count = var.enhanced_monitoring_interval > 0 ? 1 : 0

  name = "${var.project}-${var.environment}-rds-monitoring-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name        = "${var.project}-${var.environment}-rds-monitoring-role"
    Project     = var.project
    Environment = var.environment
  }
}

resource "aws_iam_role_policy_attachment" "rds_monitoring" {
  count = var.enhanced_monitoring_interval > 0 ? 1 : 0

  role       = aws_iam_role.rds_monitoring[0].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

# Secrets Manager for database credentials
resource "aws_secretsmanager_secret" "db_credentials" {
  count = var.create_secrets_manager_secret ? 1 : 0

  name        = "${var.project}/${var.environment}/aurora/credentials"
  description = "Aurora database credentials for ${var.project} ${var.environment}"

  tags = {
    Name        = "${var.project}-${var.environment}-aurora-credentials"
    Project     = var.project
    Environment = var.environment
  }
}

resource "aws_secretsmanager_secret_version" "db_credentials" {
  count = var.create_secrets_manager_secret ? 1 : 0

  secret_id = aws_secretsmanager_secret.db_credentials[0].id
  secret_string = jsonencode({
    username = var.master_username
    password = var.master_password
    host     = aws_rds_cluster.main.endpoint
    port     = aws_rds_cluster.main.port
    database = var.database_name
  })
}
