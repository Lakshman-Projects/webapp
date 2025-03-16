import healthzRouter from "./healthz-router.js";
import fileRouter from "./file-router.js";

const initializeRouters = (app) => {
    app.use("/healthz", healthzRouter);
    app.use("/v1/file", fileRouter);
};

export default initializeRouters;
