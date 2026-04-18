import { DataSource } from "typeorm";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: process.env.NODE_ENV === "development", // Enable auto-sync only in development
    logging: false,
    entities: [path.resolve(import.meta.dirname, "../entities/*.js")],
    migrations: [path.resolve(import.meta.dirname, "../../migrations/*.js")],
});

export default AppDataSource;