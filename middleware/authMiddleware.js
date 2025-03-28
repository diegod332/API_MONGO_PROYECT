const jwt = require('jsonwebtoken');

module.exports = function (requiredRole) {
    return (req, res, next) => {
      let token = req.header('Authorization');
      console.log('Token recibido:', token);
  
      if (!token) {
        console.log('Acceso denegado: No se envió un token');
        return res.status(401).json({ message: 'Acceso denegado' });
      }
  
      if (token.startsWith('Bearer ')) {
        token = token.split(' ')[1];
      }
  
      try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token verificado:', verified); 
        req.user = verified;
  
        if (requiredRole && req.user.role !== requiredRole) {
          console.log('Acceso denegado: Rol no autorizado');
          return res.status(403).json({ message: 'No tienes permiso para acceder a esta ruta' });
        }
  
        next();
      } catch (err) {
        console.error('Error al verificar el token:', err.message);
        res.status(401).json({ message: 'Token no es válido' });
      }
    };
  };