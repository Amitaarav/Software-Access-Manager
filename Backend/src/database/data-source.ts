import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entity/user-entity.js";
import { Software } from "../entity/software-entity.js";
import { Request } from "../entity/request-entity.js";
import { RequestHistory } from "../entity/request-history-entity.js";

const isProd = process.env.NODE_ENV === "production";

// Production uses DATABASE_URL, local uses individual connection parameters
const getConnectionOptions = () => {
  if (isProd && process.env.DATABASE_URL) {
    return {
      type: "postgres",
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    };
  }

  // Local Docker configuration
  return {
    type: "postgres",
    host: process.env.DATABASE_HOST || "localhost",
    port: parseInt(process.env.DATABASE_PORT || "5432"),
    username: process.env.DATABASE_USERNAME || "postgres",
    password: process.env.DATABASE_PASSWORD || "postgres",
    database: process.env.DATABASE_NAME || "user_access_db"
  };
};

export const AppDataSource = new DataSource({
  ...getConnectionOptions(),
  synchronize: false, // Keep this false for production
  logging: !isProd,
  entities: [User, Software, Request, RequestHistory],
  migrations: ["dist/database/migrations/*.js"],
  subscribers: []
} as any);

// Initialize the data source
export const initializeDataSource = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("Data Source has been initialized!");
      
      // Run migrations in production
      if (isProd) {
        console.log("Running migrations...");
        await AppDataSource.runMigrations();
        console.log("Migrations completed!");
      }
    }
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
    throw error;
  }
};
