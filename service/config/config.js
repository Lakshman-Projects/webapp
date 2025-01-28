import dotenv from 'dotenv';

// Load environment variables from .env file
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
};

// Export the constant
export default dbConfig;
