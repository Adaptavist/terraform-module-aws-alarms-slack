module "aws-lambda" {
  source          = "Adaptavist/aws-lambda/module"
  version         = "1.5.0"
  function_name   = var.function_name
  description     = var.description
  lambda_code_dir = "${path.module}/build"
  environment_variables = {
    SLACK_WEBHOOK_URL : var.slack_webhook_url
  }
  handler   = "handler.event"
  runtime   = "nodejs12.x"
  timeout   = 30
  namespace = var.namespace
  name      = var.name
  stage     = var.stage
  tags      = var.tags
}

resource "aws_sns_topic" "alarm" {
  name            = "${var.function_name}-alarm-topic"
  delivery_policy = file("${path.module}/templates/aws_sns_topic.delivery_policy.json")
  tags            = var.tags
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
