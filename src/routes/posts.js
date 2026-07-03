import { Router } from "express";
import PostController from "../controllers/postController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { validatePost } from "../middlewares/valPost.js";

const router = Router();
const postController = new PostController();

router.get("/", postController.getAll);
router.post("/", authMiddleware, validatePost, postController.create);

export default router;