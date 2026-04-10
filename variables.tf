// labelling

variable "name" {
  type    = string
  default = "function"
}

variable "namespace" {
  type = string
}

variable "stage" {
  type = string
}

variable "tags" {
  type = map(string)
}

variable "include_region" {
  type    = bool
  default = false

  description = "If set to true the current providers region will be appended to any global AWS resources such as IAM roles"
}

variable "aws_region" {
  type        = string
  description = "AWS Region"
}


// lambda

variable "function_name" {
  description = "A unique name for the lambda function."
  type        = string
}

variable "description" {
  description = "A description of the lambda function."
}
variable "memory_size" {
  description = "Amount of memory in MB your Lambda Function can use at runtime"
  default     = "128"
}

variable "timeout" {
  description = "timeout"
  default     = 30
}

variable "environment_variables" {
  description = "Environment variables"
  type        = map(string)
  default     = {}
}

variable "slack_webhook_url" {
  type = string
}
variable "display_service_name" {
  type        = string
  description = "the service using this module ie: Lifecycle Service"
}

variable "alarm_runbook_url" {
  type        = string
  default     = ""
  description = "Optional default runbook URL when no entry exists in alarm_runbook_urls for the firing alarm. Shown as a second action button; leave empty to omit unless the map supplies a URL."
}

variable "alarm_runbook_urls" {
  type        = map(string)
  default     = {}
  description = "Map of CloudWatch alarm name (exact match to AlarmName in SNS) to alarm guide URL"
}



