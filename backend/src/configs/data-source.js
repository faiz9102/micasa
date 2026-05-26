import { DataSource } from "typeorm";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import Entities from "../entities/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 18732,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: process.env.NODE_ENV === "development", // Enable auto-sync only in development
  logging: false,
  entities: Entities,
  migrations: [path.resolve(__dirname, "../../migrations/*.js")],
  ssl: {
    ca: process.env.DB_CA_CERT,
  },
});

export default AppDataSource;
