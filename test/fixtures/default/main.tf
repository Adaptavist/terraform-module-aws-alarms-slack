terraform {
  required_version = "~> 0.12.0"

  backend "local" {
    path = "terraform.tfstate"
  }
}

provider "aws" {
  region  = "eu-west-1"
}

module "this" {
  source          = "../../.."
  namespace       = "adaptavist-terraform"
  stage           = "integration"
  function_name   = "test-function"
  description     = "test hello world lambda"
  timeout         = 3
  slack_channel = "123"
  slack_token = "456"
  tags = {}
}

