const express = require('express');
const userController = require('../controllers/userController');
const clientController = require('../controllers/clientController');
const serviceController = require('../controllers/serviceController');
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Rutas de usuario
router.post('/register', userController.register); // Ruta para registrar usuario
router.post('/login', userController.login); // Ruta para iniciar sesión
router.post('/refresh', userController.refreshToken); // Ruta para renovar el token
router.post('/logout', userController.logout); // Ruta para cerrar sesión
router.get('/profile', authMiddleware, userController.getProfile); // Ruta para obtener perfil (protegida con middleware)
router.put('/update', authMiddleware, userController.updateUser); // Ruta para actualizar usuario
router.delete('/delete', authMiddleware, userController.deleteUser); // Ruta para eliminar usuario

// Rutas de clientes
router.get('/clients', authMiddleware, clientController.getAllClients); // Obtener todos los clientes
router.get('/clients/:id', authMiddleware, clientController.getClientById); // Obtener cliente por ID
router.post('/clients', authMiddleware, clientController.createClient); // Crear un cliente
router.put('/clients/:id', authMiddleware, clientController.updateClient); // Actualizar un cliente
router.delete('/clients/:id', authMiddleware, clientController.deleteClient); // Eliminar un cliente (lógica)
router.get('/clients/dropdown', authMiddleware, clientController.getClientsForDropdown); // Obtener clientes para dropdown

// Rutas de servicios
router.get('/services', authMiddleware, serviceController.getAllServices); // Obtener todos los servicios
router.get('/services/:query', authMiddleware, serviceController.getServicesByQueryOrId); // Obtener servicio por ID o consulta
router.post('/services', authMiddleware, serviceController.createService); // Crear un servicio
router.put('/services/:id', authMiddleware, serviceController.updateService); // Actualizar un servicio
router.delete('/services/:id', authMiddleware, serviceController.deleteService); // Eliminar un servicio (lógica)
router.get('/services/dropdown', authMiddleware, serviceController.getServicesForDropdown); // Obtener servicios para dropdown

// Rutas de citas
router.get('/appointments', authMiddleware, appointmentController.getAllAppointments); // Obtener todas las citas
router.get('/appointments/:id', authMiddleware, appointmentController.getAppointmentById); // Obtener una cita por ID
router.post('/appointments', authMiddleware, appointmentController.createAppointment); // Crear una cita
router.put('/appointments/:id', authMiddleware, appointmentController.updateAppointment); // Actualizar una cita
router.delete('/appointments/:id', authMiddleware, appointmentController.deleteAppointment); // Eliminar una cita (lógica)

module.exports = router;