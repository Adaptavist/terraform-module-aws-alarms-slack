terraform {

  backend "local" {
    path = "terraform.tfstate"
  }
}

provider "aws" {
  region = "eu-west-1"
}

module "this" {
  source        = "../../.."
  namespace     = "adaptavist-terraform"
  stage         = "integration"
  function_name = "test-function"
  description   = "test hello world lambda"
  timeout       = 3
  tags = {
    "Avst:BusinessUnit" : "product"
    "Avst:Product" : "foo"
    "Avst:Service" : "infra"
    "Avst:Stage:Name" : "dev"
    "Avst:Stage:Type" : "development"
    "Avst:CostCenter" : "foo"
    "Avst:Project" : "foo"
    "Avst:Team" : "foo"
  }
  slack_webhook_url = "https://techno.techno.techno"
  aws_region        = "us-west-2"
}

