# CI/CD Pipeline for Cloud-Native Image Upload API

A scalable, secure, and production-ready **Node.js/Express** backend for managing image uploads, developed as a capstone project for a graduate-level cloud computing course. The project emphasizes a robust **CI/CD pipeline** using GitHub Actions to automate testing, validation, and deployment to **AWS**. It supports **CRUD operations** for images, storing files in S3 and metadata in PostgreSQL, with auto-scaling, SSL, domain management, and advanced security features like **AWS KMS** and **Secrets Manager**, all provisioned via **Terraform**.

## Features
- **Automated CI/CD Pipeline**: Leverages GitHub Actions for integration testing, Terraform/Packer validation, and deployment to AWS EC2 using a custom AMI.
- **RESTful API**: Built with Node.js, Express, and Sequelize, following best practices (modular code, middleware, error handling).
- **Image Storage**: Uploads images to **AWS S3**, with metadata stored in **AWS RDS (PostgreSQL)**.
- **Infrastructure as Code**: Provisions AWS resources (VPC, RDS, S3, ALB, Route 53, etc.) using **Terraform**.
- **Scalability**: Implements **auto-scaling** with an **Application Load Balancer (ALB)**, scaling on-demand based on CPU utilization.
- **Security**:
  - Secures APIs with **SSL** (via AWS Certificate Manager) and encrypts data using **AWS KMS** for S3, RDS, and ALB.
  - Manages dynamic RDS passwords with **AWS Secrets Manager**, ensuring no hardcoded credentials.
  - Uses **GitHub variables** for sensitive configurations (e.g., API keys, database URLs).
- **Domain Management**: Configures a custom domain and subdomains using **AWS Route 53**.
- **Monitoring**: Tracks API performance and errors with **AWS CloudWatch** metrics, logs, and dashboards.
- **DevOps Practices**: Uses **Git** for version control, **Packer** for AMI creation, and **bash scripts** for environment setup.

## Architecture
The application follows a microservices-inspired, cloud-native architecture, with CI/CD as the backbone:

- **Client**: Sends HTTP requests to the API (e.g., via Postman or a potential frontend).
- **Route 53**: Resolves the custom domain and subdomains to the ALB.
- **Application Load Balancer (ALB)**: Distributes traffic to EC2 instances in an auto-scaling group, encrypted with KMS.
- **EC2 Instances**: Run the Node.js/Express app, built from a custom AMI (via Packer).
- **S3**: Stores image files securely, encrypted with KMS.
- **RDS (PostgreSQL)**: Stores image metadata, accessed via Sequelize ORM, with KMS-encrypted storage and dynamic passwords from Secrets Manager.
- **CloudWatch**: Collects logs, metrics (e.g., API hit counts), and alerts.
- **VPC**: Isolates resources with private subnets for RDS and public subnets for EC2.
- **KMS**: Manages encryption keys for S3, RDS, and ALB.
- **Secrets Manager**: Provides dynamic credentials for RDS access.
- **Terraform**: Defines all infrastructure, ensuring reproducibility.
- **CI/CD Pipeline**: Validates code, Terraform, and Packer configs, then deploys updates via GitHub Actions, using GitHub variables for secrets.

## API Endpoints
- **POST /v1/file**: Upload an image to S3 and save metadata to RDS.
- **GET /v1/file**: List all images with metadata.
- **GET /v1/file/:id**: Retrieve a specific image’s metadata and S3 URL.
- **DELETE /v1/file/:id**: Delete an image from S3 and its metadata from RDS.

## CI/CD Pipeline
The **GitHub Actions** pipeline is the core of the project, automating:
1. **Integration Testing**: Runs `npm test` to validate API functionality, ensuring code quality.
2. **Terraform Validation**: Executes `terraform validate` to verify infrastructure configurations.
3. **Packer Validation**: Runs `packer validate` to ensure AMI configurations are correct.
4. **Deployment**: Builds the custom AMI, updates the auto-scaling group, and deploys to EC2 instances.

Configuration: `.github/workflows/packer-custom-image-ci.yml`

Sensitive data (e.g., AWS credentials, RDS connection strings) are stored as **GitHub variables**, ensuring no hardcoding in the codebase or pipeline.

## Infrastructure Details
- **Terraform**:
  - Provisions VPC, subnets, security groups, ALB, auto-scaling group, RDS, S3, Route 53, ACM certificates, KMS keys, and Secrets Manager.
  - Files: `terraform/main.tf`, `terraform/variables.tf`, `terraform/outputs.tf`
- **Packer**:
  - Creates a custom AMI with Node.js, Express, and app dependencies.
  - File: `packer/template.json`
- **Auto-Scaling**:
  - Scales EC2 instances based on CPU utilization (>70%).
  - Configured in `terraform/autoscaling.tf`.
- **CloudWatch**:
  - Monitors API hit counts, errors, and latency.
  - Logs stored in `/aws/cloudwatch/image-api`.
- **Route 53 & SSL**:
  - Manages `yourdomain.com` and `api.yourdomain.com`.
  - SSL certificate via AWS ACM, attached to the ALB, with KMS encryption.
- **KMS**:
  - Provides server-side encryption for S3 buckets, RDS instances, and ALB.
  - Configured in `terraform/kms.tf`.
- **Secrets Manager**:
  - Stores and rotates dynamic RDS passwords, accessed securely by the application.
  - Configured in `terraform/secrets.tf`.

## Monitoring
- **CloudWatch Dashboards**: Visualize API metrics (e.g., request count, 5xx errors).
- **Alarms**: Notify on high CPU usage or RDS connection failures.
- Access via AWS Console: `CloudWatch > Logs > /aws/cloudwatch/image-api`.

## Security
- **IAM Roles**: Restrict EC2 access to S3, RDS, KMS, and Secrets Manager.
- **VPC**: Private subnets for RDS, public subnets for EC2.
- **SSL**: Enforces HTTPS via ALB and ACM.
- **KMS**: Encrypts S3, RDS, and ALB data at rest.
- **Secrets Manager**: Manages dynamic RDS credentials, eliminating hardcoded passwords.
- **GitHub Variables**: Securely stores sensitive configurations (e.g., API keys).
- **API Security**: Middleware validates inputs to prevent XSS, CSRF, and SQL injection.

## Challenges Overcome
- Streamlined CI/CD by automating Terraform and Packer validation, reducing deployment errors.
- Configured KMS and Secrets Manager to secure S3 and RDS without hardcoding credentials.
- Resolved IAM role issues for EC2-to-S3 and Secrets Manager access.
- Fixed RDS connectivity by adjusting VPC security groups.
- Optimized ALB health checks for reliable auto-scaling.

## License
MIT License. See [LICENSE](LICENSE) for details.

---

Developed as part of a graduate-level cloud computing course at Northeastern University, this project highlights expertise in **CI/CD automation**, **cloud security**, and **full-stack development**. Explore, contribute, or reach out for collaboration!