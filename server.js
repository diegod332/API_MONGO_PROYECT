const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const geneRoute = require('./routes/geneRoute');
const cors = require('cors');

//Configurando variables de entorno
dotenv.config();
//Conectando a la base de datos
connectDB();

//Inicializando express
const app = express();

//Middlewares
app.use(express.json());
app.use(cors());

//Rutas de la API
app.use('/api',geneRoute);

//Configurando Puerto
const PORT = process.env.APP_PORT || 3004;
app.listen(PORT,() => console.log(`Servidor corriendo en http://localhost:${PORT}`));
