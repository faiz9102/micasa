import {
  registerUser,
  deleteUser,
  updateUser,
  getAllUsers,
  getUserById,
} from "../services/userService.js";
import { getAdminDashboardSummary } from "../services/adminDashboardService.js";

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
        return res
          .status(404)
          .json({ status: "fail", message: result.message });
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
    const { name, email, password, role, phoneNumber } = user;
    const result = await registerUser(name, email, password, role, phoneNumber);

    if (!result.success) {
      return res.status(400).json({ status: "fail", message: result.message });
    }

    const { user: createdUser } = result;

    res.status(201).json({
      status: "success",
      user: {
        id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        phoneNumber: createdUser.phoneNumber,
      },
    });
  };
};

export const promoteAccount = function () {
  return async (req, res) => {
    const { email, name } = req.body;

    if (!email && !name) {
      return res
        .status(400)
        .json({ status: "fail", message: "Provide email or name to promote" });
    }

    const result = await (
      await import("../services/userService.js")
    ).promoteUserToAdmin({ email, name });

    if (!result.success) {
      return res.status(400).json({ status: "fail", message: result.message });
    }

    res.json({ status: "success", user: result.user });
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

export const activateAccount = function (userId) {
  return async (req, res) => {
    const result = await updateUser(userId, { isActive: true });

    if (!result.success) {
      return res.status(400).json({ status: "fail", message: result.message });
    }

    res.json({ status: "success", user: result.user });
  };
};

export const getDashboardSummary = function () {
  return async (req, res) => {
    const result = await getAdminDashboardSummary();

    if (!result.success) {
      return res.status(500).json({ status: "fail", message: result.message });
    }

    return res.json({ status: "success", summary: result.summary, recentActivity: result.recentActivity });
  };
};
