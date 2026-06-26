import { Router } from "express";
import { validateUser } from "../middlewares/valUser.js";
import { logIn, signUp } from "../controllers/authController.js";

const router = Router();
router.post("/login", validateUser, logIn);
router.post("/register", validateUser, signUp);

export default router;
