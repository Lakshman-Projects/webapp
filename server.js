import dotenv from "dotenv";
import express from "express";
import initialize from "./service/app.js";
import { logger } from "./service/middlewares/logger.js";

dotenv.config();
const app = express();

const port = process.env.PORT || 8080;
initialize(app);

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
    console.log(`Server is running on port ${port}`);
});
