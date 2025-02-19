import express from "express";
import dotenv from "dotenv";
import db from "./models/index.js";

import logger from "./middlewares/logger.js";
import initializeRouters from "./routers/index.js";
import headers from "./middlewares/header.js";
import { apiMiddleware, errorHandler } from "./middlewares/responseHandler.js";

dotenv.config();

const initialize = async (app) => {
    // Set up middlewares
    app.use(express.json({ limit: "1mb" })); // Parse JSON bodies
    app.use(express.urlencoded({ limit: "5mb", extended: true })); // Parse URL-encoded bodies
    app.use(logger); // Log HTTP requests
    app.use(headers); // Set headers
    app.use(apiMiddleware); // API middleware
    app.use(errorHandler); // Error handler

    // Set up the database
    const setupDb = async () => {
        // Database connection
        try {
            const database = await db;
            await database.sequelize.authenticate(); // Authenticate once db is ready
            console.log("Database connected successfully.");
        } catch (error) {
            console.error("Unable to connect to the database:", error);
        }

        // Sync the database
        try {
            const database = await db;
            await database.sequelize.sync(); // Sync once db is ready
            console.log("Database synchronized successfully.");
        } catch (error) {
            console.error("Unable to sync the database:", error);
        }
    };
    
    await setupDb();

    // Initialize the routers
    initializeRouters(app);
};

export default initialize;
