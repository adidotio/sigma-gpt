import express from "express";
import { signup, login, logout, checkAuth, verifyPassword, updateProfile } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, checkAuth);
router.post("/verify-password", authMiddleware, verifyPassword);
router.put("/profile", authMiddleware, updateProfile);

export default router;