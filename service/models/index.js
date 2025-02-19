import { readdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Sequelize, DataTypes } from "sequelize";
import process from "process";
import dbConfig from "../config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || "development";
const config = dbConfig[env];
console.log(config);
console.log(env);
console.log(dbConfig);
const db = {};
const sequelize = new Sequelize(config.url, config);

const files = readdirSync(__dirname).filter(
    (file) =>
        file.indexOf(".") !== 0 &&
        file !== path.basename(__filename) &&
        file.slice(-3) === ".js"
);

const importModels = async () => {
    for (const file of files) {
        const model = await import(`./${file}`);
        const namedModel = model.default(sequelize, DataTypes);
        db[namedModel.name] = namedModel;
    }

    Object.keys(db).forEach((modelName) => {
        if (db[modelName].associate) {
            db[modelName].associate(db);
        }
    });

    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    return db;
};

export default importModels();