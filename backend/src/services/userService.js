import { UserRepository } from "../repositories/userRepository.js";
import { hash } from "../utils/password.js";
import { UserRole } from "../entities/User.js";

/**
 * Registers a new user by validating the input, checking for existing email, hashing the password, and saving the user to the database.
 * @param {string} name - The user's name
 * @param {string} email - The user's email
 * @param {string} password - The user's password
 * @param {string} role - The user's role (optional, defaults to "user")
 * @returns {Promise<Object>} - An object indicating success and newly created user or an error message
 */
export const registerUser = async (name, email, password, role = UserRole.USER) => {
  try {
    const existingUser = await UserRepository.emailExists(email);
    if (existingUser) {
      return { success: false, message: "Email is already registered" };
    }

    // Create a new user
    const hashedPassword = await hash(password);
    const newUser = await UserRepository.createUser({
      name,
      email,
      password: hashedPassword,
      role
    });

    return { success: true, user: newUser };
  } catch (error) {
    console.error("Error registering user:", error);
    return { success: false, message: "Internal server error" };
  }
};


/**
 * Updates a user's information, including optional password hashing if the password is being updated.
 * @param {string} id - The ID of the user to update
 * @param {Object} updateData - An object containing the fields to update (e.g., name, email, password)
 * @returns {Promise<Object>} - An object indicating success and the updated user or an error message
 */
export const updateUser = async (id, updateData) => {
  try {
    const existingUser = await UserRepository.findById(id);
    if (!existingUser) {
      return { success: false, message: "User not found" };
    }

    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await UserRepository.emailExists(updateData.email);
      if (emailExists) {
        return { success: false, message: "Email is already in use" };
      }
    }

    if (updateData.password) {
      updateData.password = await hash(updateData.password);
    }

    const updatedUser = await UserRepository.save({ ...existingUser, ...updateData });

    if (!updatedUser) {
      return { success: false, message: "User not found" };
    }
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, message: "Internal server error" };
  }
};

/**
 * Deletes a user by their ID.
 * @param {string} id - The ID of the user to delete
 * @returns {Promise<Object>} - An object indicating success or failure
 */
export const deleteUser = async (id) => {
  try {
    const isDeleted = await UserRepository.deleteUser(id);
    if (!isDeleted) {
      return { success: false, message: "User not found" };
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: "Internal server error" };
  }
};

/**
 * Retrieves a user by their ID.
 * @param {string} id - The ID of the user to retrieve
 * @returns {Promise<Object>} - An object indicating success and the retrieved user or an error message
 */
export const getUserById = async (id) => {
  try {
    const user = await UserRepository.findById(id);
    if (!user) {
      return { success: false, message: "User not found" };
    }
    return { success: true, user };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { success: false, message: "Internal server error" };
  }
};

export const getUserByEmail = async (email) => {
  try {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      return { success: false, message: "User not found" };
    }
    return { success: true, user };
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return { success: false, message: "Internal server error" };
  }
};

export const getAllUsers = async () => {
  try {
    const users = await UserRepository.find();
    return { success: true, users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, message: "Internal server error" };
  }
};

export const getActiveUsers = async () => {
  try {
    const users = await UserRepository.findActiveUsers();
    return { success: true, users };
  } catch (error) {
    console.error("Error fetching active users:", error);
    return { success: false, message: "Internal server error" };
  }
};

export const getInActiveUsers = async () => {
  try {
    const users = await UserRepository.findInActiveUsers();
    return { success: true, users };
  } catch (error) {
    console.error("Error fetching inactive users:", error);
    return { success: false, message: "Internal server error" };
  }
};