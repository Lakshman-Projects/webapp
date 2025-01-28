import { createHealthCheck } from "../services/healthz-service.js";

export const getAppHealthz = async (req, res) => {
    try {
        // Try adding entry to the health_checks table
        await createHealthCheck();

        res.status(200).send('OK');
    } catch (error) {
        res.status(503);
    }
};