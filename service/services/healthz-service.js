import db from "../models/index.js";
import { measureDbQuery } from "../middlewares/statd-metrics.js";

const { HealthCheck } = await db;

export const createHealthCheck = async () => {
    try {
        const datetime = new Date(); // Current UTC date and time
        const healthCheckEntry = await measureDbQuery(() => HealthCheck.create({ datetime: datetime }), 'create_health_check');
        return healthCheckEntry;
    } catch (error) {
        throw error;
    }
};
