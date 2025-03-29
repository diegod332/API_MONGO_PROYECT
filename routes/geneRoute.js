const express = require('express');
const userController = require('../controllers/userController');
const clientController = require('../controllers/clientController');
const serviceController = require('../controllers/serviceController');
const appointmentController = require('../controllers/appointmentController');
const supplyController = require('../controllers/supplyController');
const recurringAppointmentController = require('../controllers/recurringAppointmentController');
const appointmentServiceController = require('../controllers/appointmentServiceController');
const appointmentSupplyController = require('../controllers/appointmentSupplyController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Operaciones relacionadas con usuarios
 *   - name: Clients
 *     description: Operaciones relacionadas con clientes
 *   - name: Services
 *     description: Operaciones relacionadas con servicios
 *   - name: Appointments
 *     description: Operaciones relacionadas con citas
 *   - name: Supplies
 *     description: Operaciones relacionadas con insumos
 *   - name: Recurring Appointments
 *     description: Operaciones relacionadas con citas recurrentes
 *   - name: Appointment Services
 *     description: Relaciones entre citas y servicios
 *   - name: Appointment Supplies
 *     description: Relaciones entre citas y suministros
 */

// Rutas de usuario
/**
 * @swagger
 * /register:
 *   post:
 *     tags: [Users]
 *     summary: Registrar un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 */
router.post('/register', userController.register);

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Users]
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', userController.login);

/**
 * @swagger
 * /refresh:
 *   post:
 *     tags: [Users]
 *     summary: Renovar token de acceso
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token renovado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Token inválido o expirado
 */
router.post('/refresh', userController.refreshToken);

/**
 * @swagger
 * /logout:
 *   post:
 *     tags: [Users]
 *     summary: Cerrar sesión
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 *       401:
 *         description: No autorizado
 */
router.post('/logout', userController.logout);

/**
 * @swagger
 * /profile:
 *   get:
 *     tags: [Users]
 *     summary: Obtener perfil del usuario actual
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autorizado
 */
router.get('/profile', authMiddleware(), userController.getProfile);

/**
 * @swagger
 * /update:
 *   put:
 *     tags: [Users]
 *     summary: Actualizar información del usuario
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: No autorizado
 */
router.put('/update', authMiddleware(), userController.updateUser);

/**
 * @swagger
 * /delete:
 *   delete:
 *     tags: [Users]
 *     summary: Eliminar cuenta de usuario
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       401:
 *         description: No autorizado
 */
router.delete('/delete', authMiddleware(), userController.deleteUser);

// Rutas de clientes
/**
 * @swagger
 * /clients:
 *   get:
 *     tags: [Clients]
 *     summary: Obtener todos los clientes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 */
router.get('/clients', authMiddleware(), clientController.getAllClients);

/**
 * @swagger
 * /clients/{id}:
 *   get:
 *     tags: [Clients]
 *     summary: Obtener un cliente por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles del cliente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Client'
 *       404:
 *         description: Cliente no encontrado
 */
router.get('/clients/:id', authMiddleware(), clientController.getClientById);

/**
 * @swagger
 * /clients:
 *   post:
 *     tags: [Clients]
 *     summary: Crear un nuevo cliente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 */
router.post('/clients', authMiddleware(), clientController.createClient);

/**
 * @swagger
 * /clients/{id}:
 *   put:
 *     tags: [Clients]
 *     summary: Actualizar un cliente existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Client'
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Cliente no encontrado
 */
router.put('/clients/:id', authMiddleware(), clientController.updateClient);

/**
 * @swagger
 * /clients/{id}:
 *   delete:
 *     tags: [Clients]
 *     summary: Eliminar un cliente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cliente eliminado exitosamente
 *       404:
 *         description: Cliente no encontrado
 */
router.delete('/clients/:id', authMiddleware(), clientController.deleteClient);

/**
 * @swagger
 * /clients/dropdown:
 *   get:
 *     tags: [Clients]
 *     summary: Obtener lista de clientes para dropdown
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista simplificada de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
router.get('/clients/dropdown', authMiddleware(), clientController.getClientsForDropdown);

// Rutas de servicios
/**
 * @swagger
 * /services:
 *   get:
 *     tags: [Services]
 *     summary: Obtener todos los servicios
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de servicios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Service'
 */
router.get('/services', authMiddleware(), serviceController.getAllServices);

/**
 * @swagger
 * /services/{query}:
 *   get:
 *     tags: [Services]
 *     summary: Obtener servicio por ID o consulta
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del servicio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Service'
 *       404:
 *         description: Servicio no encontrado
 */
router.get('/services/:query', authMiddleware(), serviceController.getServicesByQueryOrId);

/**
 * @swagger
 * /services:
 *   post:
 *     tags: [Services]
 *     summary: Crear un nuevo servicio
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       201:
 *         description: Servicio creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 */
router.post('/services', authMiddleware(), serviceController.createService);

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     tags: [Services]
 *     summary: Actualizar un servicio existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Service'
 *     responses:
 *       200:
 *         description: Servicio actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Servicio no encontrado
 */
router.put('/services/:id', authMiddleware(), serviceController.updateService);

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     tags: [Services]
 *     summary: Eliminar un servicio
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Servicio eliminado exitosamente
 *       404:
 *         description: Servicio no encontrado
 */
router.delete('/services/:id', authMiddleware(), serviceController.deleteService);

/**
 * @swagger
 * /services/dropdown:
 *   get:
 *     tags: [Services]
 *     summary: Obtener lista de servicios para dropdown
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista simplificada de servicios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
router.get('/services/dropdown', authMiddleware(), serviceController.getServicesForDropdown);

// Rutas de citas
/**
 * @swagger
 * /appointments:
 *   get:
 *     tags: [Appointments]
 *     summary: Obtener todas las citas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de citas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 */
router.get('/appointments', authMiddleware(), appointmentController.getAllAppointments);

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     tags: [Appointments]
 *     summary: Obtener una cita por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles de la cita
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Cita no encontrada
 */
router.get('/appointments/:id', authMiddleware(), appointmentController.getAppointmentById);

/**
 * @swagger
 * /appointments:
 *   post:
 *     tags: [Appointments]
 *     summary: Crear una nueva cita
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: Cita creada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 */
router.post('/appointments', authMiddleware(), appointmentController.createAppointment);

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     tags: [Appointments]
 *     summary: Actualizar una cita existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       200:
 *         description: Cita actualizada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Cita no encontrada
 */
router.put('/appointments/:id', authMiddleware(), appointmentController.updateAppointment);

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     tags: [Appointments]
 *     summary: Eliminar una cita
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cita eliminada exitosamente
 *       404:
 *         description: Cita no encontrada
 */
router.delete('/appointments/:id', authMiddleware(), appointmentController.deleteAppointment);

// Rutas de insumos
/**
 * @swagger
 * /supplies:
 *   get:
 *     tags: [Supplies]
 *     summary: Obtener todos los insumos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de insumos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Supply'
 */
router.get('/supplies', authMiddleware(), supplyController.getAllSupplies);

/**
 * @swagger
 * /supplies/{id}:
 *   get:
 *     tags: [Supplies]
 *     summary: Obtener un insumo por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles del insumo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Supply'
 *       404:
 *         description: Insumo no encontrado
 */
router.get('/supplies/:id', authMiddleware(), supplyController.getSupplyById);

/**
 * @swagger
 * /supplies:
 *   post:
 *     tags: [Supplies]
 *     summary: Crear un nuevo insumo
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supply'
 *     responses:
 *       201:
 *         description: Insumo creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 */
router.post('/supplies', authMiddleware(), supplyController.createSupply);

/**
 * @swagger
 * /supplies/{id}:
 *   put:
 *     tags: [Supplies]
 *     summary: Actualizar un insumo existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Supply'
 *     responses:
 *       200:
 *         description: Insumo actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Insumo no encontrado
 */
router.put('/supplies/:id', authMiddleware(), supplyController.updateSupply);

/**
 * @swagger
 * /supplies/{id}:
 *   delete:
 *     tags: [Supplies]
 *     summary: Eliminar un insumo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Insumo eliminado exitosamente
 *       404:
 *         description: Insumo no encontrado
 */
router.delete('/supplies/:id', authMiddleware(), supplyController.deleteSupply);

// Rutas de citas recurrentes
/**
 * @swagger
 * /recurring-appointments:
 *   get:
 *     tags: [Recurring Appointments]
 *     summary: Obtener todas las citas recurrentes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de citas recurrentes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RecurringAppointment'
 */
router.get('/recurring-appointments', authMiddleware(), recurringAppointmentController.getAllRecurringAppointments);

/**
 * @swagger
 * /recurring-appointments/{id}:
 *   get:
 *     tags: [Recurring Appointments]
 *     summary: Obtener una cita recurrente por ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles de la cita recurrente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RecurringAppointment'
 *       404:
 *         description: Cita recurrente no encontrada
 */
router.get('/recurring-appointments/:id', authMiddleware(), recurringAppointmentController.getRecurringAppointmentById);

/**
 * @swagger
 * /recurring-appointments:
 *   post:
 *     tags: [Recurring Appointments]
 *     summary: Crear una nueva cita recurrente
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecurringAppointment'
 *     responses:
 *       201:
 *         description: Cita recurrente creada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 */
router.post('/recurring-appointments', authMiddleware(), recurringAppointmentController.createRecurringAppointment);

/**
 * @swagger
 * /recurring-appointments/{id}:
 *   put:
 *     tags: [Recurring Appointments]
 *     summary: Actualizar una cita recurrente existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecurringAppointment'
 *     responses:
 *       200:
 *         description: Cita recurrente actualizada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Cita recurrente no encontrada
 */
router.put('/recurring-appointments/:id', authMiddleware(), recurringAppointmentController.updateRecurringAppointment);

/**
 * @swagger
 * /recurring-appointments/{id}:
 *   delete:
 *     tags: [Recurring Appointments]
 *     summary: Eliminar una cita recurrente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cita recurrente eliminada exitosamente
 *       404:
 *         description: Cita recurrente no encontrada
 */
router.delete('/recurring-appointments/:id', authMiddleware(), recurringAppointmentController.deleteRecurringAppointment);

// Rutas para manejar relaciones entre citas y servicios
/**
 * @swagger
 * /appointment-services:
 *   get:
 *     tags: [Appointment Services]
 *     summary: Obtener todas las relaciones cita-servicio
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de relaciones cita-servicio
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AppointmentService'
 */
router.get('/appointment-services', authMiddleware(), appointmentServiceController.getAllAppointmentServices);

/**
 * @swagger
 * /appointment-services/{appointment_id}/{service_id}:
 *   get:
 *     tags: [Appointment Services]
 *     summary: Obtener una relación cita-servicio específica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointment_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: service_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles de la relación cita-servicio
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppointmentService'
 *       404:
 *         description: Relación no encontrada
 */
router.get('/appointment-services/:appointment_id/:service_id', authMiddleware(), appointmentServiceController.getAppointmentServiceById);

/**
 * @swagger
 * /appointment-services:
 *   post:
 *     tags: [Appointment Services]
 *     summary: Crear una nueva relación cita-servicio
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AppointmentService'
 *     responses:
 *       201:
 *         description: Relación creada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 */
router.post('/appointment-services', authMiddleware(), appointmentServiceController.createAppointmentService);

/**
 * @swagger
 * /appointment-services/{appointment_id}/{service_id}:
 *   put:
 *     tags: [Appointment Services]
 *     summary: Actualizar una relación cita-servicio existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointment_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: service_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AppointmentService'
 *     responses:
 *       200:
 *         description: Relación actualizada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Relación no encontrada
 */
router.put('/appointment-services/:appointment_id/:service_id', authMiddleware(), appointmentServiceController.updateAppointmentService);

/**
 * @swagger
 * /appointment-services/{appointment_id}/{service_id}:
 *   delete:
 *     tags: [Appointment Services]
 *     summary: Eliminar una relación cita-servicio
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointment_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: service_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relación eliminada exitosamente
 *       404:
 *         description: Relación no encontrada
 */
router.delete('/appointment-services/:appointment_id/:service_id', authMiddleware(), appointmentServiceController.deleteAppointmentService);

// Rutas para manejar relaciones entre citas y suministros
/**
 * @swagger
 * /appointment-supplies:
 *   get:
 *     tags: [Appointment Supplies]
 *     summary: Obtener todas las relaciones cita-suministro
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de relaciones cita-suministro
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AppointmentSupply'
 */
router.get('/appointment-supplies', authMiddleware(), appointmentSupplyController.getAllAppointmentSupplies);

/**
 * @swagger
 * /appointment-supplies/{appointment_id}/{supply_id}:
 *   get:
 *     tags: [Appointment Supplies]
 *     summary: Obtener una relación cita-suministro específica
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointment_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: supply_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalles de la relación cita-suministro
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AppointmentSupply'
 *       404:
 *         description: Relación no encontrada
 */
router.get('/appointment-supplies/:appointment_id/:supply_id', authMiddleware(), appointmentSupplyController.getAppointmentSupplyById);

/**
 * @swagger
 * /appointment-supplies:
 *   post:
 *     tags: [Appointment Supplies]
 *     summary: Crear una nueva relación cita-suministro
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AppointmentSupply'
 *     responses:
 *       201:
 *         description: Relación creada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 */
router.post('/appointment-supplies', authMiddleware(), appointmentSupplyController.createAppointmentSupply);

/**
 * @swagger
 * /appointment-supplies/{appointment_id}/{supply_id}:
 *   put:
 *     tags: [Appointment Supplies]
 *     summary: Actualizar una relación cita-suministro existente
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointment_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: supply_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AppointmentSupply'
 *     responses:
 *       200:
 *         description: Relación actualizada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Relación no encontrada
 */
router.put('/appointment-supplies/:appointment_id/:supply_id', authMiddleware(), appointmentSupplyController.updateAppointmentSupply);

/**
 * @swagger
 * /appointment-supplies/{appointment_id}/{supply_id}:
 *   delete:
 *     tags: [Appointment Supplies]
 *     summary: Eliminar una relación cita-suministro
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointment_id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: supply_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Relación eliminada exitosamente
 *       404:
 *         description: Relación no encontrada
 */
router.delete('/appointment-supplies/:appointment_id/:supply_id', authMiddleware(), appointmentSupplyController.deleteAppointmentSupply);

module.exports = router;