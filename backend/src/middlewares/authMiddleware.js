import { loginSchema } from "@micasa/shared/validations/user.schema.js";
import { getCookie } from "../utils/cookie.js";
import config from "../config.json" with { type: "json" };
import { verifyToken, parseBearerToken } from "../utils/token.js";

export const ACCESS_TOKEN_COOKIE_NAME = "__HOST" + config?.auth?.cookie?.accessTokenName;
export const REFRESH_TOKEN_COOKIE_NAME = "__HOST" + config?.auth?.cookie?.refreshTokenName;

export const ACCESS_TOKEN_COOKIE_OPTIONS = {
  ...config?.auth?.cookie?.accessTokenOptions,
  maxAge: config?.auth?.jwt?.accessTokenExpirationMs,
};

export const REFRESH_TOKEN_COOKIE_OPTIONS = {
  ...config?.auth?.cookie?.refreshTokenOptions,
  maxAge: config?.auth?.jwt?.refreshTokenExpirationMs,
};

export const authAccessMiddleware = (req, res, next) => {
  try {
    const accessToken = getCookie(req, ACCESS_TOKEN_COOKIE_NAME) || parseBearerToken(req);

    if (accessToken) {
      const decoded = verifyToken(accessToken, process.env.JWT_SECRET);

      if (decoded) {
        req.middleware = { user: decoded };
      }
    }
  } catch (err) {
  } finally {
    next();
  }
};

export const authRefreshMiddleware = (req, res, next) => {
  const refreshToken = getCookie(req, REFRESH_TOKEN_COOKIE_NAME);

  if (refreshToken) {
    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (decoded) {
      req.middleware = { user: decoded };
    }
  }

  next();
};

export const roleBasedAccessControl = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req?.middleware?.user?.role;

    if (!userRole) {
      return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ status: "fail", message: "Forbidden" });
    }

    next();
  };
};

export const requireBuyerAccess = (req, res, next) => {
  const user = req?.middleware?.user;

  if (!user?.id) {
    return res.status(401).json({ status: "fail", message: "Unauthorized" });
  }

  if (user.role === "admin") {
    return res.status(403).json({ status: "fail", message: "Forbidden" });
  }

  if (user.loggedInAsSeller === true) {
    return res.status(403).json({ status: "fail", message: "Forbidden" });
  }

  return next();
};

export const requireSellerAccess = (req, res, next) => {
  const user = req?.middleware?.user;

  if (!user?.id) {
    return res.status(401).json({ status: "fail", message: "Unauthorized" });
  }

  if (user.role === "admin") {
    return res.status(403).json({ status: "fail", message: "Forbidden" });
  }

  if (user.loggedInAsSeller !== true) {
    return res.status(403).json({ status: "fail", message: "Forbidden" });
  }

  return next();
};

export const requireAuth = (req, res, next) => {
  const userId = req?.middleware?.user?.id;

  if (!userId) {
    return res.status(401).json({ status: "fail", message: "Unauthorized" });
  }

  return next();
};

export const validateLoginRequest = (req, res, next) => {
  const { email, password } = req.body;

  const result = loginSchema.safeParse({ email, password });

  if (result.success) {
    req.user = result.data;
    next();
  } else {
    // TODO : send descriptive error message.
    res.status(400).json({ status: "fail", message: "Invalid form data" });
  }
};
