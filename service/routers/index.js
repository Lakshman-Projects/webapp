import loginRouter from "./login-router.js";

const initializeRouters = (app) => {
    app.use("/healthz", loginRouter);
};

export default initializeRouters;
