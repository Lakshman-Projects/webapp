import healthzRouter from "./healthz-router.js";

const initializeRouters = (app) => {
    app.use("/healthz", healthzRouter);
};

export default initializeRouters;
