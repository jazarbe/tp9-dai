import AuthService from "../services/authService"

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
}