import db from "../models/index.js";
import { s3 } from "../config/aws.js";
import { measureDbQuery, measureS3Call } from "../middlewares/statd-metrics.js";

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

        const s3Response = await measureS3Call(() => s3.upload(params).promise(), 'upload_file');

        const fileRecord = await measureDbQuery(() => File.create({
            fileName: originalname,
            url: s3Response.Location,
            size,
            mimeType: mimetype,
        }), 'create_file_record');

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
        const file = await measureDbQuery(() => File.findByPk(fileId), 'get_file_record');
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

export const deleteFile = async (fileId) => {
    try {
        const file = await measureDbQuery(() => File.findByPk(fileId), 'get_file_record');
        if (!file) {
            throw new Error("File not found");
        }

        const params = {
            Bucket: process.env.S3_BUCKET,
            Key: file.url.split("/").pop(),
        };
        await measureS3Call(() => s3.deleteObject(params).promise(), 'delete_file');

        await measureDbQuery(() => file.destroy(), 'delete_file_record');
    } catch (error) {
        throw error;
    }
};