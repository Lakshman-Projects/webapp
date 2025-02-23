packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0, < 2.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "aws_profile" {
  type    = string
  default = "default"
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "ami_regions" {
  type    = list(string)
  default = ["us-east-1"]
}

variable "ssh_username" {
  type    = string
  default = "ubuntu"
}

variable "subnet_id" {
  type    = string
  default = "subnet-xxxxxxxx"
}

variable "instance_type" {
  type    = string
  default = "t2.micro"
}

variable "demo_account_id" {
  type    = string
  default = "xxxxxxxxxxxx"
}

source "amazon-ebs" "my-aws-machine-image" {
  profile         = var.aws_profile
  region          = var.aws_region
  ami_name        = "csye6225-{{timestamp}}"
  ami_description = "AMI for CSYE6225"
  ami_regions     = var.ami_regions
  ami_users       = [var.demo_account_id]

  source_ami_filter {
    filters = {
      name                = "ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-20250115"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["099720109477"]
  }

  instance_type = var.instance_type
  ssh_username  = var.ssh_username
  subnet_id     = var.subnet_id

  launch_block_device_mappings {
    delete_on_termination = true
    device_name           = "/dev/sda1"
    volume_size           = 8
    volume_type           = "gp2"
  }
}

build {
  sources = [
    "source.amazon-ebs.my-aws-machine-image"
  ]
}
