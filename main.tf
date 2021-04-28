module "labels" {
  source    = "git::https://github.com/cloudposse/terraform-terraform-label.git?ref=tags/0.5.0"
  namespace = var.namespace
  stage     = var.stage
  name      = var.name
  tags      = var.tags
}

module "aws-lambda" {
  source                             = "Adaptavist/aws-lambda/module"
  version                            = "1.10.0"
  function_name                      = var.function_name
  disable_label_function_name_prefix = true
  include_region                     = var.include_region
  description                        = var.description
  lambda_code_dir                    = "${path.module}/build"
  environment_variables = {
    SLACK_WEBHOOK_URL : var.slack_webhook_url
    DISPLAY_NAME      : var.display_service_name
    STAGE             : var.stage
  }
  handler    = "handler.event"
  runtime    = "nodejs12.x"
  timeout    = 30
  namespace  = module.labels.namespace
  name       = module.labels.name
  stage      = module.labels.stage
  tags       = module.labels.tags
  aws_region = var.aws_region
}

resource "aws_sns_topic" "alarm" {
  name            = "${module.labels.id}-${var.function_name}"
  delivery_policy = file("${path.module}/templates/aws_sns_topic.delivery_policy.json")
  tags            = module.labels.tags
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
