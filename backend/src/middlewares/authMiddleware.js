const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ error: 'Acceso denegado.' });

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Token inválido.' });
    }
}

exports.verifyRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.tipo)) {
            return res.status(403).json({ error: 'Acceso denegado. Permiso insuficiente.' });
        }
        next();
    };
};
