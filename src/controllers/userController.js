import UserService from "../services/userService.js";
import logHelper from "../helpers/logHelper.js";

const userService = new UserService();

export default class UserController {
    getProfile = async (req, res) => {
        try {
            const userId = req.user.id; 
            
            const profileData = await userService.getProfileWithPosts(userId);
            if (!profileData) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            return res.status(200).json(profileData);
        } catch (error) {
            logHelper.logError(error);
            return res.status(500).json({ error: 'Error al obtener el perfil' });
        }
    }

    updateProfile = async (req, res) => {
        try {
            const userId = req.user.id;
            const { fullname, bio, pfp } = req.body;

            const updatedUser = await userService.updateProfile(userId, { fullname, bio, pfp });
            return res.status(200).json({ 
                message: 'Perfil actualizado con éxito', 
                user: updatedUser 
            });
        } catch (error) {
            logHelper.logError(error);
            return res.status(500).json({ error: 'Error al actualizar el perfil' });
        }
    }
}