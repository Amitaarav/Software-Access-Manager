import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

dotenv.config();

function getEnvVariable(key: string): string {
  const value = process.env[key];
  if (!value) {
    console.error(`Environment variable ${key} is not set`);
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

const AppDataSource = new DataSource({
  type: "postgres",
  host: getEnvVariable("DATABASE_HOST"),
  port: parseInt(getEnvVariable("DATABASE_PORT")),
  username: getEnvVariable("DATABASE_USERNAME"),
  password: getEnvVariable("DATABASE_PASSWORD"),
  database: getEnvVariable("DATABASE_NAME"),
  synchronize: true,
  logging: false,
  entities: ["src/entity/*.ts"],
  migrations: ["src/migration/*.js"],
  subscribers: [],
});

export { AppDataSource }; 