const mongoose = require('mongoose');

const appointmentServiceSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment', // Referencia al modelo de citas
    required: true,
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service', // Referencia al modelo de servicios
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Fecha de creación de la relación
  },
  updatedAt: {
    type: Date,
    default: null, // Fecha de última actualización
  },
});

module.exports = mongoose.model('AppointmentService', appointmentServiceSchema);