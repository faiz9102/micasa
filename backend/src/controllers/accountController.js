import AppDataSource from "../configs/data-source.js";
import User from "../entities/User.js";
import { hashPassword } from "../utils/crypto.js";

export const getAccount = async (req, res) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: req.params.id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Error fetching account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAccount = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: req.user.id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = name || user.name;
    user.email = email || user.email;

    if (password) {
      user.password = await hashPassword(password);
    }

    await userRepository.save(user);

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Error updating account:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export async function createAccount(req, res) {
    try {
        const { name, email, password,  type } = req.user;

        const userRepository = AppDataSource.getRepository(User);
        const existingUser = await userRepository.findOneBy({ email });

        if (existingUser) {
            return res.status(400).json({ status: "fail", error: "Email already in use" });
        }

        const hashedPassword = await hashPassword(password);

        const newUser = userRepository.create({
            name,
            email,
            password: hashedPassword,
            role: type,
        });

        await userRepository.save(newUser);

        res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
        });
    } catch (error) {
        console.error("Error creating account:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}