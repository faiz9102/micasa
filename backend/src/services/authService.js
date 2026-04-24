import { compare } from "bcrypt";
import { UserRepository } from "../repositories/userRepository.js";
import { hash } from "../utils/password.js";

/**
 * Authenticates a user by their email and password.
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @returns {Promise<Object>} - An object indicating success and the authenticated user or an error message
 */
export const authenticateUser = async (email, password) => {
  try {
    const user = await UserRepository.getByEmailForLogin(email);
    if (!user) {
      return { success: false, message: "Invalid email or password" };
    }

    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      return { success: false, message: "Invalid email or password" };
    }

    return { success: true, user };
  } catch (error) {
    console.error("Error authenticating user:", error);
    return { success: false, message: "Internal server error" };
  }
};