import db from "../models/index.js";

const { HealthCheck } = await db;

export const createHealthCheck = async () => {
    try {
        const datetime = new Date(); // Current UTC date and time
        const healthCheckEntry = await HealthCheck.create({ datetime: datetime });
        return healthCheckEntry;
    } catch (error) {
        throw error;
    }
};
