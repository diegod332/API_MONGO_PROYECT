const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Odontología Integral',
      version: '1.0.0',
      description: 'Documentación de la API para el sistema de gestión de citas, clientes, servicios e insumos',
    },
    servers: [
      {
        url: 'http://odontologiaintegral.site/api',
        description: 'Servidor de producción',
      },
      {
        url: 'http://localhost:3004/api',
        description: 'Servidor de desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' },
            role: { type: 'string', enum: ['admin', 'user'] },
          },
        },
        Client: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            email: { type: 'string', format: 'email' },
            phone: { type: 'string' },
            address: { type: 'string' },
          },
        },
        Service: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            duration: { type: 'integer' },
            price: { type: 'number' },
          },
        },
        Appointment: {
          type: 'object',
          properties: {
            client_id: { type: 'integer' },
            date: { type: 'string', format: 'date-time' },
            status: { type: 'string', enum: ['scheduled', 'completed', 'cancelled'] },
            notes: { type: 'string' },
          },
        },
        Supply: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            quantity: { type: 'integer' },
            price: { type: 'number' },
          },
        },
        RecurringAppointment: {
          type: 'object',
          properties: {
            client_id: { type: 'integer' },
            start_date: { type: 'string', format: 'date-time' },
            end_date: { type: 'string', format: 'date-time' },
            recurrence_pattern: { type: 'string' },
            notes: { type: 'string' },
          },
        },
        AppointmentService: {
          type: 'object',
          properties: {
            appointment_id: { type: 'integer' },
            service_id: { type: 'integer' },
            quantity: { type: 'integer' },
          },
        },
        AppointmentSupply: {
          type: 'object',
          properties: {
            appointment_id: { type: 'integer' },
            supply_id: { type: 'integer' },
            quantity: { type: 'integer' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/geneRoute.js'],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  
};