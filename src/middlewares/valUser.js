export const validateUser = async (req, res, next) => {
    const { username } = req.body.username;
    const { password } = req.body.password;
    
    if (!validaString(username) || !validaString(password)) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }
    req.user = user;
    next();
}

function validaString(cadena) {
    return typeof cadena === 'string' && cadena.trim().length > 0
}
