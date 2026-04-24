import config from "../config.json" with { type: "json" };
import jwt from "jsonwebtoken";
import { getUserById } from "../services/userService.js";

export const generateAccessToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: config?.auth?.jwt?.accessTokenExpirationMs / 1000 ?? "15m",
    });
  } catch (err) {
    console.error("Error generating access token:", err);
    return null;
  }
};

export const generateRefreshToken = (payload) => {
  try {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: config?.auth?.jwt?.refreshTokenExpirationMs / 1000 ?? "7d",
    });
  } catch (err) {
    console.error("Error generating refresh token:", err);
    return null;
  }
};

export const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
};

export const getRotatedAccessToken = async (refreshToken) => {
  const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);
  if (!decoded) {
    return null;
  }

  const { id } = decoded;

  const user = await getUserById(id);
  if (!user) {
    return null;
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  return generateAccessToken(payload);
};
