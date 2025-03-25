import { createHealthCheck } from "../services/healthz-service.js";
import { logWithRequest } from "../middlewares/logger.js";

export const getAppHealthz = async (req, res) => {
    try {
        // Try adding entry to the health_checks table
        await createHealthCheck();

        res.status(200).send();
    } catch (error) {
        logWithRequest(req, "error", error.message || "Unable to create health check");
        res.status(503).send();
    }
};