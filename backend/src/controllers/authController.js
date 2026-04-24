import { authenticateUser } from "../services/authService.js";
import { generateAccessToken, generateRefreshToken, getRotatedAccessToken } from "../utils/token.js";
import { setCookie, clearCookie, getCookie } from "../utils/cookie.js";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_OPTIONS,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from "../middlewares/authMiddleware.js";

export const loginUser = function (user) {
  return async (req, res) => {
    const { email, password } = user;

    const result = await authenticateUser(email, password);

    if (!result.success) {
      return res.status(400).json({ status: "fail", message: result.message });
    }

    const accessToken = await generateAccessToken({
      id: result.user.id,
      email: result.user.email,
      name: result.user.name,
      role: result.user.role,
    });

    const refreshToken = await generateRefreshToken({
      id: result.user.id,
    });

    setCookie(
      res,
      ACCESS_TOKEN_COOKIE_NAME,
      accessToken,
      ACCESS_TOKEN_COOKIE_OPTIONS,
    );

    setCookie(
      res,
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS,
    );

    res.json({
      status: "success",
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
      },
    });
  };
};

export const logoutUser = function () {
  return (req, res) => {
    clearCookie(res, ACCESS_TOKEN_COOKIE_NAME, ACCESS_TOKEN_COOKIE_OPTIONS);

    clearCookie(res, REFRESH_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_OPTIONS);

    res.json({status: "success", message: "Logged out successfully" });
  };
};

export const refreshToken = function () {
  return async (req, res) => {
    const refreshToken = getCookie(req, REFRESH_TOKEN_COOKIE_NAME);

    const newAccessToken = await getRotatedAccessToken(refreshToken);

    if (!newAccessToken) {
      return res.status(401).json({ status: "fail", message: "Invalid refresh token" });
    }

    setCookie(
      res,
      ACCESS_TOKEN_COOKIE_NAME,
      newAccessToken,
      ACCESS_TOKEN_COOKIE_OPTIONS
    );

    res.json({ status: "success", message: "Token refreshed successfully" });
  };
}