import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
    class HealthCheck extends Model {
        static associate(models) {
            // Define associations here
        }
    }
    HealthCheck.init(
        {
            checkId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            datetime: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "HealthCheck",
            tableName: "health_checks",
            timestamps: false,
        }
    );
    return HealthCheck;
};
