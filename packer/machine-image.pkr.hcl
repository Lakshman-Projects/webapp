packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0, < 2.0.0"
      source  = "github.com/hashicorp/amazon"
    }
  }
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

source "amazon-ebs" "my-aws-machine-image" {
  region          = var.aws_region
  ami_name        = "csye6225-{{timestamp}}"
  ami_description = "AMI for CSYE6225"
  ami_regions     = var.ami_regions

  source_ami_filter {
    filters = {
      name                = "ubuntu/images/*ubuntu-24.04-amd64-server-*"
      root-device-type    = "ebs"
      virtualization-type = "hvm"
    }
    most_recent = true
    owners      = ["099720109477"]
  }

  instance_type = "t2.micro"
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
