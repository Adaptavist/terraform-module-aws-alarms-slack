module "labels" {
  source = "git::https://github.com/cloudposse/terraform-null-label.git?ref=488ab91e34a24a86957e397d9f7262ec5925586a" # <- version 0.25.0

  namespace = var.namespace
  stage     = var.stage
  name      = var.name
  tags      = var.tags
}

data "aws_caller_identity" "this" {}

module "aws-lambda" {
  source = "git::https://github.com/Adaptavist/terraform-module-aws-lambda.git?ref=8f1dcd0cf05cbb9f2aba8382e87a892a85ad07d8" # <- version 1.35.7

  function_name                      = var.function_name
  disable_label_function_name_prefix = true
  include_region                     = var.include_region
  description                        = var.description
  lambda_code_dir                    = "${path.module}/build"
  environment_variables = {
    SLACK_WEBHOOK_URL : var.slack_webhook_url
    ACCOUNT_DISPLAY_NAME : var.display_service_name
    STAGE : var.stage
  }
  handler    = "handler.event"
  runtime    = "nodejs16.x"
  timeout    = var.timeout
  namespace  = module.labels.namespace
  name       = module.labels.name
  stage      = module.labels.stage
  tags       = module.labels.tags
  aws_region = var.aws_region
}

resource "aws_kms_key" "sns" {
  description             = "Slack notification SNS topic encryption"
  policy                  = data.aws_iam_policy_document.sns_kms.json
  deletion_window_in_days = 10
  tags                    = module.labels.tags
}

data "aws_iam_policy_document" "sns_kms" {
  statement {
    sid    = "cloudwatch"
    effect = "Allow"
    actions = [
      "kms:Decrypt",
      "kms:GenerateDataKey*"
    ]
    resources = ["*"]
    principals {
      identifiers = ["cloudwatch.amazonaws.com"]
      type        = "Service"
    }
  }
  statement {
    sid    = "admin"
    effect = "Allow"
    actions = [
      "kms:*"
    ]
    resources = ["*"]
    principals {
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.this.account_id}:root"]
      type        = "AWS"
    }
  }
}

resource "aws_kms_alias" "sns" {
  target_key_id = aws_kms_key.sns.id
  name_prefix   = "alias/sns-kms"
}

resource "aws_sns_topic" "alarm" {
  name              = "${module.labels.id}-${var.function_name}"
  delivery_policy   = file("${path.module}/templates/aws_sns_topic.delivery_policy.json")
  kms_master_key_id = aws_kms_key.sns.id

  tags = module.labels.tags
}



resource "aws_sns_topic_subscription" "sns-alarm" {
  topic_arn = aws_sns_topic.alarm.arn
  protocol  = "lambda"
  endpoint  = module.aws-lambda.lambda_arn
}

resource "aws_lambda_permission" "sns-permission" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = module.aws-lambda.lambda_arn
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.alarm.arn
}
