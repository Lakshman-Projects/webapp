import { Model } from "sequelize";
import { v4 as uuid } from "uuid";

export default (sequelize, DataTypes) => {
    class File extends Model {
        static associate(models) {
            // Define associations here
        }
    }
    File.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: () => uuid(),
                primaryKey: true,
            },
            fileName: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            url: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            size: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            mimeType: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "File",
            tableName: "files",
            timestamps: true,
        }
    );
    return File;
};