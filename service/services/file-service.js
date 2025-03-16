import db from "../models/index.js";
import { s3 } from "../config/aws.js";

const { File } = await db;

export const uploadFile = async (file) => {
    try {
        const { originalname, size, mimetype, buffer } = file;
        const s3Key = `${Date.now()}-${originalname}`;

        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: s3Key,
            Body: buffer,
            ContentType: mimetype,
        };

        const s3Response = await s3.upload(params).promise();

        const fileRecord = await File.create({
            fileName: originalname,
            url: s3Response.Location,
            size,
            mimeType: mimetype,
        });

        return {
            file_name: fileRecord.fileName,
            id: fileRecord.id,
            url: fileRecord.url,
            upload_date: fileRecord.createdAt.toISOString().split("T")[0],
        };
    } catch (error) {
        throw error;
    }
};

export const getFile = async (fileId) => {
    try {
        const file = await File.findByPk(fileId);
        if (!file) {
            throw new Error("File not found");
        }
        return {
            file_name: file.fileName,
            id: file.id,
            url: file.url,
            upload_date: file.createdAt.toISOString().split("T")[0],
        };
    } catch (error) {
        throw error;
    }
};