import {
  registerUser,
  deleteUser,
  updateUser,
  getAllUsers,
  getUserById,
} from "../services/userService.js";

/**
 * Fetches account information. If userId is provided, it fetches the specific user; otherwise, it retrieves all users.
 * @param {string|null} userId
 * @returns {function} Express route handler
 */
export const getAccount = function (userId = null) {
  return async (req, res) => {
    if (userId) {
      const result = await getUserById(userId);
      if (!result.success) {
        return res.status(404).json({ status: "fail", message: result.message });
      }
      return res.json({ status: "success", user: result.user });
    }

    const result = await getAllUsers();
    if (!result.success) {
      return res.status(500).json({ status: "fail", message: result.message });
    }
    res.json({ status: "success", users: result.users });
  };
};

export const createAccount = function (user) {
  return async (req, res) => {
    const { name, email, password, role } = user;
    const result = await registerUser(name, email, password, role);

    if (!result.success) {
      return res.status(400).json({ status: "fail", message: result.message });
    }

    const { user: createdUser } = result;

    res.status(201).json({ status: "success", user: { id: createdUser.id, name: createdUser.name, email: createdUser.email} });
  };
};

export const updateAccount = function (userId, updateData) {
  return async (req, res) => {
    const result = await updateUser(userId, updateData);

    if (!result.success) {
      return res.status(400).json({ status: "fail", message: result.message });
    }

    res.json({ status: "success", user: result.user });
  };
};

export const deleteAccount = function (userId) {
  return async (req, res) => {
    const result = await deleteUser(userId);

    if (!result.success) {
      return res.status(404).json({ status: "fail", message: result.message });
    }

    res.json({ status: "success", message: "User deleted successfully" });
  };
};

export const deactivateAccount = function (userId) {
  return async (req, res) => {
    const result = await updateUser(userId, { isActive: false });

    if (!result.success) {
      return res.status(400).json({ status: "fail", message: result.message });
    }

    res.json({ status: "success", user: result.user });
  };
};