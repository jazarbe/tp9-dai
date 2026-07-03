import jwt from "jsonwebtoken";
const SECRET_KEY = process.env.JWT_SECRET || "ClaveSecreta2000$"; 

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Acceso denegado. Token no provisto o formato inválido." });
    }
    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; 
        next(); 
    } catch (error) {
        return res.status(401).json({ error: "Token inválido o expirado." });
    }
};