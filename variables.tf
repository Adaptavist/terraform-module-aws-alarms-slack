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
  type    = map(string)
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
  default = 30
}

variable "environment_variables" {
  description = "Environment variables"
  type        = map(string)
  default     = {}
}

variable "slack_token" {
  type = string
}

variable "slack_channel" {
  type = string
}



