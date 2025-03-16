import AWS from "aws-sdk";

// Configure AWS SDK
AWS.config.update({
    region: process.env.AWS_REGION || "us-east-1",
});

// Initialize S3 client
const s3 = new AWS.S3();

export { s3 };