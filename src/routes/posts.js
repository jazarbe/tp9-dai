import { Router } from "express";
import PostController from "../controllers/postController.js";

const router = Router();
const postController = new PostController();

router.get("/", postController.getAll);

export default router;