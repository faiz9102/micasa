import userschema from "@micasa/shared/validations/user.schema.js";
import AppDataSource from "../configs/data-source.js";
import User, { UserRole } from "../entities/User.js";
import { UserRepository } from "../repositories/userRepository.js";

export const validateAccountCreationRequest = async (req, res, next) => {
  const { name, email, password, role = "user" } = req.body;
  const normalizedRole = role || UserRole.USER;

  const result = userschema.safeParse({ name, email, password, role: normalizedRole });

  if (result.success) {
    if (result.data.role === UserRole.ADMIN) {
      const adminCount = await UserRepository.countAdmins();
      if (adminCount > 0) {
        return res.status(403).json({ status: "fail", message: "Admin already exists" });
      }
    }

    req.user = result.data;
    return next();
  } else {
    // TODO : send descriptive error message.
    res.status(400).json({ status: "fail", message: "Invalid form data" });
  }
};

export const validateAccountUpdateRequest = (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    res.status(400).json({ status: "fail", message: "Invalid user id" });
  }

  try {
    const user = AppDataSource.getRepository(User).findOneBy({ id });
    if (!user) {
      res.status(404).json({ status: "fail", message: "User not found" });
    }
    req.user = user;
    next();
  } catch (e) {
    console.error("Error fetching user:", e?.message);
    res.status(500).json({ status: "fail", message: "Internal server error" });
  }
};
