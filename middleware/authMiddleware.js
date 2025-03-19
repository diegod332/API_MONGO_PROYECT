const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = function (req, res, next) {
    let token = req.header('Authorization'); // Obtiene el token del encabezado 'Authorization'
    if (!token) return res.status(401).json({ message: 'Acceso denegado' });

    // Maneja el caso en que el token venga con el prefijo 'Bearer'
    if (token.startsWith('Bearer ')) {
        token = token.split(' ')[1]; // Extrae solo el token
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET); // Verifica el token
        req.user = verified; // Agrega los datos decodificados del token al objeto req
        next(); // Continúa con el siguiente middleware o controlador
    } catch (err) {
        res.status(401).json({ message: 'Token no es válido' }); // Responde con 401 si el token no es válido
    }
};