const mongoose = require('mongoose');

const recurringAppointmentSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client', // Referencia al modelo de clientes
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  interval: {
    type: String,
    enum: ['semanal', 'mensual'], // Solo permite valores válidos
    required: true,
  },
  duration: {
    type: Number, // Duración en minutos
    required: true,
  },
  status: {
    type: String,
    enum: ['pendiente', 'confirmado', 'finalizado'],
    default: 'pendiente',
    required: true,
  },
  deletedAt: {
    type: Date,
    default: null, // Eliminación lógica
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

module.exports = mongoose.model('RecurringAppointment', recurringAppointmentSchema);