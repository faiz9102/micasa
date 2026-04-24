import { Router } from "express";
import { loginUser, logoutUser, refreshToken } from "../controllers/authController.js";
import { validateLoginRequest } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", validateLoginRequest, (req, res) => {
  loginUser(req.user)(req, res);
});

router.all("/refresh", (req, res) => {
  refreshToken()(req, res);
});

router.all("/logout", (req, res) => {
  logoutUser()(req, res);
});

export default router;
