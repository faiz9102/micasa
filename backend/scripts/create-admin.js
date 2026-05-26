import bcrypt from "bcrypt";
import AppDataSource from "../src/configs/data-source.js";
import User from "../src/entities/User.js";
import dotenv from "dotenv";

dotenv.config();

async function seedAdmin() {
  await AppDataSource.initialize();

  const repo = AppDataSource.getRepository(User);

  const existing = await repo.findOne({
    where: { email: "admin@micasa.com" },
  });

  if (existing) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  await repo.save({
    name: "Admin",
    email: "admin@micasa.com",
    password: hashedPassword,
    role: "admin",
    isActive: true,
  });

  console.log("Admin created");
}

seedAdmin();