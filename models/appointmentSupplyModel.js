const mongoose = require('mongoose');

const appointmentSupplySchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment', // Referencia al modelo de citas
    required: true,
  },
  supply: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supply', // Referencia al modelo de suministros
    required: true,
  },
  quantityUsed: {
    type: Number, // Cantidad de suministro utilizado
    required: true,
    min: 1, // No puede ser menor que 1
  },
  createdAt: {
    type: Date,
    default: Date.now, // Fecha de creación de la relación
  },
  updatedAt: {
    type: Date,
    default: null, // Fecha de última actualización
  },
  deletedAt: {
    type: Date,
    default: null, // Eliminación lógica
  },
});

module.exports = mongoose.model('AppointmentSupply', appointmentSupplySchema);