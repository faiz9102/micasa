import userschema from "@micasa/shared/validations/user.schema.js";
import AppDataSource from "../configs/data-source.js";
import User, { UserRole } from "../entities/User.js";
import { UserRepository } from "../repositories/userRepository.js";

export const validateAccountCreationRequest = async (req, res, next) => {
  const { name, email, password, phoneNumber } = req.body;

  // Enforce role as USER for all registrations initiated from the public form.
  const role = UserRole.USER;

  const result = userschema.safeParse({ name, email, password, phoneNumber, role });

  if (result.success) {
    // Always set role to `user` — admin accounts cannot be created from registration.
    req.user = { ...result.data, role };
    return next();
  } else {
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
