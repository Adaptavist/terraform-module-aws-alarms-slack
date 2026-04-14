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
| alarm_runbook_url        | string        | `""`      | no       | Default runbook URL for the optional **View runbook** button when the firing alarm is not listed in `alarm_runbook_urls` |
| alarm_runbook_urls       | map(string)   | `{}`      | no       | Map of CloudWatch **alarm name** (exact match to `AlarmName` in the SNS payload) to runbook URL. Per-alarm URL takes precedence over `alarm_runbook_url`. To be used when multiple alarms use the same lambda. |

## Runbook URLs

Example module block with a default runbook and per-alarm overrides:

```hcl
module "alarm_slack" {
  source = "git::https://github.com/Adaptavist/terraform-module-aws-alarms-slack.git?ref=x.y.z"

  # ... other required arguments (namespace, stage, tags, aws_region, function_name, description, slack_webhook_url, display_service_name)

  alarm_runbook_url = "https://wiki.example.com/team/on-call/runbooks"

  alarm_runbook_urls = {
    "joint-my-service-num-reqs-high"     = "https://wiki.example.com/runbooks/high-traffic"
    "joint-my-service-conx-error-count"  = "https://wiki.example.com/runbooks/connection-errors"
  }
}
```

In this example `joint-my-service-num-reqs-high` and `joint-my-service-conx-error-count` will point to specific runbooks, and all other alarms point to the generic runbook.

## Outputs

| Name                    | Description                                                       |
| ----------------------- | ----------------------------------------------------------------- |
| lambda_arn              | The ARN of the Lambda Function                                    |
| alarms_topic_arn        | The ARN of the SNS topic                                          |

## Slack message format
The Slack message is formatted to match the following:

![demo](https://raw.githubusercontent.com/Adaptavist/terraform-module-aws-alarms-slack/master/demo.png)