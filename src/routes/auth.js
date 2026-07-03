import { Router } from "express";
import { validateUser } from "../middlewares/valUser.js";
import { validateRegister } from "../middlewares/valRegister.js";
import AuthController from "../controllers/authController.js";

const router = Router();
const authController = new AuthController();

router.post("/login", validateUser, authController.logIn);
router.post("/register", validateRegister, authController.signUp);

export default router;