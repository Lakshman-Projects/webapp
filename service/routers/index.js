import healthzRouter from "./healthz-router.js";
import fileRouter from "./file-router.js";
import { apiMiddleware } from "../middlewares/responseHandler.js";

const initializeRouters = (app) => {
    app.use("/healthz", apiMiddleware, healthzRouter);
    app.use("/v1/file", fileRouter);
};

export default initializeRouters;
