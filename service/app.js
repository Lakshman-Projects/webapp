import express from "express";
import cors from "cors";
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const initialize = (app) => {
    const corsOptions = {
        methods: process.env.CORS_METHODS,
    };

    // Set up middlewares
    app.use(cors(corsOptions)); // Enable CORS
    app.use(express.json({ limit: '1mb' })); // Parse JSON bodies
    app.use(express.urlencoded({ limit: '5mb', extended: true })); // Parse URL-encoded bodies

    // Database connection
    const sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USERNAME,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: process.env.DB_DIALECT,
        }
    );

    const connectDatabase = async () => {
        try {
            await sequelize.authenticate();
            console.log("Database connected successfully.");
        } catch (error) {
            console.error("Unable to connect to the database:", error);
        }
    };

    connectDatabase();
};

export default initialize;
