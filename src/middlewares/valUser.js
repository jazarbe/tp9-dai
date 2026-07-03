export const validateUser = async (req, res, next) => {
    const { username } = req.body.username;
    const { password } = req.body.password;
    
    if (!validaString(username) || !validaString(password)) {
        return res.status(400).json({ error: 'Invalid username or password' });
    }
    res.body = req.body;
    next();
}

export const validateRegister = (req, res, next) => {
    const { username, fullname, email, password } = req.body;
    
    if (!validaString(username) || !validaString(fullname) || !validaString(email) || !validaString(password)) {
        return res.status(400).json({ error: 'Faltan campos obligatorios o son inválidos' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'El formato del email no es válido' });
    }
    res.body = req.body;
    next();
};

function validaString(cadena) {
    return typeof cadena === 'string' && cadena.trim().length > 0;
}