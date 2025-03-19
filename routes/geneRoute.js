const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Rutas de usuario
router.post('/register', userController.register); // Ruta para registrar usuario
router.post('/login', userController.login); // Ruta para iniciar sesión
router.get('/profile', authMiddleware, userController.getProfile); // Ruta para obtener perfil (protegida con middleware)

module.exports = router;