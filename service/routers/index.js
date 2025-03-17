import healthzRouter from "./healthz-router.js";
import fileRouter from "./file-router.js";
import { apiMiddleware, apiFileMiddleware } from "../middlewares/responseHandler.js";

const initializeRouters = (app) => {
    app.use("/healthz", apiMiddleware, healthzRouter);
    app.use("/v1/file", apiFileMiddleware, fileRouter);
};

export default initializeRouters;