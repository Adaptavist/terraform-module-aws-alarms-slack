output "alarms_topic_arn" {
  value = aws_sns_topic.alarm.arn
}

output "lambda_arn" {
  value = module.aws-lambda.lambda_arn
}