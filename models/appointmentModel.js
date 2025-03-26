const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
  appointmentDate: {
    type: Date,
    required: true,
  },
  appointmentTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pendiente', 'confirmado', 'Finalizado'],
    default: 'pendiente',
    required: true,
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  },
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
  ],
  deletedAt: {
    type: Date,
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
module.exports = mongoose.model('Appointment', appointmentSchema);