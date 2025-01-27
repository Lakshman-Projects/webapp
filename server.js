import dotenv from "dotenv";
import express from "express";

dotenv.config();
const app = express();

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
