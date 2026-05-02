import { Router } from "express";
import { loginUser, logoutUser, refreshToken } from "../controllers/authController.js";
import { validateLoginRequest, authRefreshMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/admin/login", validateLoginRequest, (req, res) => {
  loginUser(req.user, { requireAdmin: true })(req, res);
});

router.post("/buyer/login", validateLoginRequest, (req, res) => {
  loginUser(req.user, { disallowAdmin: true, loggedInAsSeller: false })(req, res);
});

router.post("/seller/login", validateLoginRequest, (req, res) => {
  loginUser(req.user, { disallowAdmin: true, loggedInAsSeller: true })(req, res);
});

router.all("/refresh", authRefreshMiddleware, (req, res) => {
  refreshToken()(req, res);
});

router.all("/logout", (req, res) => {
  logoutUser()(req, res);
});

export default router;
