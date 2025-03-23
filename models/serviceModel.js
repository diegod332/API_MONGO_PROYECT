const mongoose = require('mongoose');

// Definición del esquema de servicio
const serviceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  deletedAt: {
    type: Date, // Campo para eliminación lógica
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
});

// Crear el modelo
const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;