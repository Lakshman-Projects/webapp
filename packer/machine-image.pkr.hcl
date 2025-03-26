packer {
  required_plugins {
    amazon = {
      version = ">= 1.0.0, < 2.0.0"
      source  = "github.com/hashicorp/amazon"
    }
    googlecompute = {
      version = ">= 1.0.0, < 2.0.0"
      source  = "github.com/hashicorp/googlecompute"
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

variable "gcp_project_id" {
  type    = string
  default = "xxxxxx"
}

variable "machine_type" {
  type    = string
  default = "n1-standard-1"
}

variable "gcp_zone" {
  type    = string
  default = "us-east1-d"
}

variable "disk_size" {
  type    = number
  default = 10
}

variable "disk_type" {
  type    = string
  default = "pd-standard"
}

variable "gcp_network" {
  type    = string
  default = "default"
}

variable "gcp_source_image" {
  type    = string
  default = "ubuntu-2404-noble-amd64-v20250214"
}

variable "gcp_source_image_family" {
  type    = string
  default = "ubuntu-2404-noble-amd64"
}

variable "credentials_file" {
  type    = string
  default = "/tmp/credentials.json"
}

variable "db_name" {
  type    = string
  default = "application_db"
}

variable "dev_db_name" {
  type    = string
  default = "application_db_dev"
}

variable "test_db_name" {
  type    = string
  default = "application_db_test"
}

variable "db_user" {
  type    = string
  default = "admin_user"
}

variable "db_password" {
  type    = string
  default = "StrongPassword!@#456"
}

variable "app_group" {
  type    = string
  default = "app_services"
}

variable "app_user" {
  type    = string
  default = "service_account"
}

source "amazon-ebs" "my-aws-machine-image" {
  profile         = var.aws_profile
  region          = var.aws_region
  ami_name        = "csye6225-{{timestamp}}"
  ami_description = "Custom Ubuntu 24.04 LTS AMI for CSYE6225 with pre-installed dependencies and optimized configurations."
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

source "googlecompute" "my-gcp-machine-image" {
  project_id          = var.gcp_project_id
  credentials_file    = var.credentials_file
  source_image        = var.gcp_source_image
  source_image_family = var.gcp_source_image_family
  zone                = var.gcp_zone

  image_project_id        = var.gcp_project_id
  image_name              = "csye6225-{{timestamp}}"
  image_description       = "Custom Ubuntu 24.04 LTS Image for CSYE6225 with pre-installed dependencies and optimized configurations."
  image_storage_locations = ["us"]

  machine_type = var.machine_type
  disk_size    = var.disk_size
  disk_type    = var.disk_type
  network      = var.gcp_network
  ssh_username = var.ssh_username
  tags         = ["csye6225", "custom-image"]
}

build {
  sources = [
    "source.amazon-ebs.my-aws-machine-image",
  ]

  provisioner "file" {
    source      = "/tmp/lakshman_siva_repo.zip"
    destination = "/tmp/lakshman_siva_repo.zip"
  }

  provisioner "file" {
    source      = "/tmp/.env"
    destination = "/tmp/.env"
  }

  provisioner "file" {
    source      = "setup.sh"
    destination = "/tmp/setup.sh"
  }

  provisioner "file" {
    source      = "packer/app.service"
    destination = "/tmp/app.service"
  }

  provisioner "file" {
    source      = "packer/amazon-cloudwatch-agent.json"
    destination = "/tmp/amazon-cloudwatch-agent.json"
    only        = ["amazon-ebs.my-aws-machine-image"]
  }

  provisioner "shell" {
    inline = [
      "sed -i 's/\r$//' /tmp/setup.sh",

      # Conditional logic for AWS and GCP
      "if [ \"${source.name}\" = 'my-aws-machine-image' ]; then",
      "sudo sh /tmp/setup.sh ${var.app_group} ${var.app_user}",
      "wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb",
      "sudo dpkg -i amazon-cloudwatch-agent.deb",
      "sudo systemctl enable amazon-cloudwatch-agent",
      "sudo mkdir -p /opt/aws/amazon-cloudwatch-agent/etc",
      "sudo mv /tmp/amazon-cloudwatch-agent.json /opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.json",

      "elif [ \"${source.name}\" = 'my-gcp-machine-image' ]; then",
      "sudo sh /tmp/setup.sh ${var.app_group} ${var.app_user} ${var.db_name} ${var.dev_db_name} ${var.test_db_name} ${var.db_user} ${var.db_password}",
      "fi",

      "sudo mv /tmp/app.service /etc/systemd/system/app.service",
      "sudo systemctl daemon-reload",
      "sudo systemctl enable app.service",
      "sudo systemctl start app.service",
    ]
  }
}
