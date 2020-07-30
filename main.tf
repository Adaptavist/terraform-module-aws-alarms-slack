module "aws-lambda" {
  source  = "Adaptavist/aws-lambda/module"
  version = "1.2.0"
  function_name = var.function_name
  description = var.description
  lambda_code_dir = "${path.module}/build"
  environment_variables = {
    SLACK_TOKEN: var.slack_token,
    SLACK_CHANNEL: var.slack_channel
  }
  handler = "handler.js"
  runtime = "nodejs10.x"
  timeout = 30
  namespace = var.namespace
  name = var.name
  stage = var.stage
  tags = var.tags
}

resource "aws_sns_topic" "alarm" {
  name            = "${var.function_name}-alarm-topic"
  delivery_policy = file("${path.module}/templates/aws_sns_topic.delivery_policy.json")
}

resource "aws_sns_topic_subscription" "user_updates_sqs_target" {
  topic_arn = aws_sns_topic.alarm.arn
  protocol  = "lambda"
  endpoint  = module.aws-lambda.lambda_arn
}
