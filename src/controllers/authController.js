import AuthService from "../services/authService.js"
import bcrypt from "bcrypt";

const authService = new AuthService()

export default class AuthController {
    logIn = async (req, res) => {
        const { username, password } = req.body;
        const user = await authService.getByUsername(username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        return res.status(200).json({ message: 'Login successful', user });
    }
    signUp = async (req, res) => {
        const { username, fullname, email, password, pfp, bio } = req.body;

        try {
            const userExists = await authService.checkUserExists(username, email);
            if (userExists) {
                return res.status(400).json({ error: 'El nombre de usuario o email ya están registrados' });
            }

            const saltRounds = 10; 
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = {
                username,
                fullname,
                email,
                password: hashedPassword,
                pfp: pfp || 'default.jpg',
                bio: bio || null
            };

            const createdUser = await authService.createUser(newUser);

            return res.status(201).json({ 
                message: 'Usuario registrado con éxito', 
                user: createdUser 
            });

        } catch (error) {
            console.error("Error en signUp:", error);
            return res.status(500).json({ error: 'Error interno del servidor al registrar el usuario' });
        }
    }
}