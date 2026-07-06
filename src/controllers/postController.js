import PostService from "../services/postService.js";
import LogHelper from "../helpers/logHelper.js";

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

    create = async (req, res) => {
        try {
            const { url_image, description } = req.body;
            const userId = req.user.id; 
            const newPost = await postService.createPost({ url_image, description, userId });
            
            return res.status(201).json({ 
                message: 'Publicación creada con éxito', 
                post: newPost 
            });
        } catch (error) {
            LogHelper.logError(error);
            return res.status(500).json({ error: 'Error interno del servidor al crear la publicación' });
        }
    }
}