import AuthService from "../services/authService.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 

const authService = new AuthService()
const SECRET_KEY = process.env.JWT_SECRET || "ClaveSecreta2000$"; 

export default class AuthController {
    logIn = async (req, res) => {
        const { username, password } = req.body;
        
        try { 
            const user = await authService.getByUsername(username);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid password' });
            }

            const payload = { id: user.id, username: user.username, email: user.email };
            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' });

            delete user.password;

           
            return res.status(200).json({ 
                message: 'Login successful', 
                token: `Bearer ${token}`, 
                user 
            });

        } catch (error) {
            console.error("Error en logIn:", error);
            return res.status(500).json({ error: 'Internal server error' });
        }
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
// import AuthService from "../services/authService.js"
// import bcrypt from "bcrypt";

// const authService = new AuthService()

// export default class AuthController {
//     logIn = async (req, res) => {
//         const { username, password } = req.body;
//         const user = await authService.getByUsername(username);
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         if (user.password !== password) {
//             return res.status(401).json({ error: 'Invalid password' });
//         }
//         return res.status(200).json({ message: 'Login successful', user });
//     }
//     signUp = async (req, res) => {
//         const { username, fullname, email, password, pfp, bio } = req.body;

//         try {
//             const userExists = await authService.checkUserExists(username, email);
//             if (userExists) {
//                 return res.status(400).json({ error: 'El nombre de usuario o email ya están registrados' });
//             }

//             const saltRounds = 10; 
//             const hashedPassword = await bcrypt.hash(password, saltRounds);

//             const newUser = {
//                 username,
//                 fullname,
//                 email,
//                 password: hashedPassword,
//                 pfp: pfp || 'default.jpg',
//                 bio: bio || null
//             };

//             const createdUser = await authService.createUser(newUser);

//             return res.status(201).json({ 
//                 message: 'Usuario registrado con éxito', 
//                 user: createdUser 
//             });

//         } catch (error) {
//             console.error("Error en signUp:", error);
//             return res.status(500).json({ error: 'Error interno del servidor al registrar el usuario' });
//         }
//     }
// }