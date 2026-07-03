import { Router } from "express";
import UserController from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();
const userController = new UserController();
router.get("/perfil", authMiddleware, userController.getProfile);
router.put("/perfil", authMiddleware, userController.updateProfile);

export default router;
