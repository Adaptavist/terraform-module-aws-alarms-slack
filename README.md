# AWS Slack Alarm Notifications

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

This module creates an SNS Topic and an AWS Lambda function that forwards the message from the topic to the given Slack workspace.

## Variables

| Name                           | Type    | Default | Required | Description                                                                                                                                                          |
| ------------------------------ | ------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| function_name                  | string  |         | ✓       | A unique name for the lambda function                                                                                                                                |
| description                    | string  |         | ✓       | A description of the lambda function                                                                                                                                 |
| memory_size                    | integer | 128     |          | Amount of memory in MB your Lambda Function can use at runtime                                                                                                       |
| reserved_concurrent_executions | string  | -1      |          | The amount of reserved concurrent executions for this lambda function. A value of 0 disables lambda from being triggered and -1 removes any concurrency limitations. |
| timeout                        | integer | 30      |          | timeout                                                                                                                                                              |
| namespace                      | string  |         | ✓       | Namespace used for labeling resources                                                                                                                                |
| name                           | string  |         | ✓       | Name of the module / resources                                                                                                                                       |
| stage                          | string  |         | ✓       | What stage are the resources for? staging, production?                                                                                                               |
| tags                           | map     |         | ✓       | Map of tags to be applied to all resources                                                                                                                           |
| slack_webhook_url              | string  |         | ✓       | The Slack Webhook URL to which the formatted message is sent                                                                                                         |
| display_service_name           | string  |         | ✓       | A friendly name of the service ie: Lifecycle Service                                                                                                                 |

## Outputs

| Name                    | Description                                                       |
| ----------------------- | ----------------------------------------------------------------- |
| lambda_arn              | The ARN of the Lambda Function                                    |
| alarms_topic_arn        | The ARN of the SNS topic                                          |

## Slack message format
The Slack message is formatted to match the following:

![demo](https://raw.githubusercontent.com/Adaptavist/terraform-module-aws-alarms-slack/master/demo.png)