import PostService from "../services/postService.js";

const postService = new PostService();

export default class PostController {
    getAll = async (req, res) => {
        try {
            const posts = await postService.getAllPosts();
            
            return res.status(200).json(posts);
        } catch (error) {
            console.error("Error en PostController.getAll:", error);
            return res.status(500).json({ error: 'Error interno del servidor al obtener las publicaciones' });
        }
    }
}