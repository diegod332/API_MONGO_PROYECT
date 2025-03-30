const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const geneRoute = require('./routes/geneRoute');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

dotenv.config();

connectDB();

const app = express();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Odontología Integral',
      version: '1.0.0',
      description: 'Documentación de la API para el sistema de gestión de citas, clientes, servicios e insumos',
    },
    servers: [
      {
        url: `${process.env.BASE_URL || `http://localhost:${process.env.APP_PORT || 3004}/api`}`,
        description: 'Servidor de producción',
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
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/geneRoute.js'], 
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api', geneRoute);

const PORT = process.env.APP_PORT || 3004;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}\nDocumentación Swagger en http://localhost:${PORT}/api-docs`));