import dotenv from 'dotenv';
dotenv.config();

// Initialize the configuration object
const dbConfig = {
  development: {
    url: process.env.DEV_DATABASE_URL,
    dialect: process.env.DATABASE_DIALECT,
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: process.env.DATABASE_DIALECT,
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: process.env.DATABASE_DIALECT,
  },
  cloud: {
    url: process.env.CLOUD_DATABASE_URL,
    dialect: process.env.DATABASE_DIALECT,
    dialectOptions: {
      ssl: {
        require: true, // Enforce SSL
        rejectUnauthorized: false
      }
    },
  },
};

export default dbConfig;
