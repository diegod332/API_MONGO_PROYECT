const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const geneRoute = require('./routes/geneRoute');
const cors = require('cors');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api',geneRoute);

const PORT = process.env.APP_PORT || 3004;
app.listen(PORT,() => console.log(`Servidor corriendo en http://localhost:${PORT}`));
