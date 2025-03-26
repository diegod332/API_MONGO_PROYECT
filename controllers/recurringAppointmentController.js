const RecurringAppointment = require('../models/recurringAppointmentModel');

// Obtener todas las citas recurrentes
exports.getAllRecurringAppointments = async (req, res) => {
  try {
    const appointments = await RecurringAppointment.find({ deletedAt: null })
      .populate('client', 'firstName middleName lastName'); // Poblar datos del cliente
    res.status(200).json({ status: 'success', data: appointments });
  } catch (error) {
    console.error('Error al obtener citas recurrentes:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener citas recurrentes', error: error.message });
  }
};

// Obtener una cita recurrente por ID
exports.getRecurringAppointmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await RecurringAppointment.findOne({ _id: id, deletedAt: null })
      .populate('client', 'firstName middleName lastName'); // Poblar datos del cliente
    if (!appointment) {
      return res.status(404).json({ status: 'error', message: 'Cita recurrente no encontrada' });
    }
    res.status(200).json({ status: 'success', data: appointment });
  } catch (error) {
    console.error('Error al obtener la cita recurrente:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener la cita recurrente', error: error.message });
  }
};

// Crear una nueva cita recurrente
exports.createRecurringAppointment = async (req, res) => {
  const { client, startDate, startTime, interval, duration, status } = req.body;

  // Validar campos requeridos
  if (!client || !startDate || !startTime || !interval || !duration) {
    return res.status(400).json({ status: 'error', message: 'Todos los campos son obligatorios' });
  }

  try {
    const newAppointment = new RecurringAppointment({
      client,
      startDate,
      startTime,
      interval,
      duration,
      status: status || 'pendiente', // Usar el estado por defecto si no se proporciona
    });
    const savedAppointment = await newAppointment.save();
    res.status(201).json({ status: 'success', data: savedAppointment });
  } catch (error) {
    console.error('Error al crear la cita recurrente:', error);
    res.status(500).json({ status: 'error', message: 'Error al crear la cita recurrente', error: error.message });
  }
};

// Actualizar una cita recurrente
exports.updateRecurringAppointment = async (req, res) => {
  const { id } = req.params;
  const { client, startDate, startTime, interval, duration, status } = req.body;

  try {
    const updatedAppointment = await RecurringAppointment.findOneAndUpdate(
      { _id: id, deletedAt: null }, // Buscar cita no eliminada
      { client, startDate, startTime, interval, duration, status, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedAppointment) {
      return res.status(404).json({ status: 'error', message: 'Cita recurrente no encontrada o ya eliminada' });
    }
    res.status(200).json({ status: 'success', data: updatedAppointment });
  } catch (error) {
    console.error('Error al actualizar la cita recurrente:', error);
    res.status(500).json({ status: 'error', message: 'Error al actualizar la cita recurrente', error: error.message });
  }
};

// Eliminar una cita recurrente (eliminación lógica)
exports.deleteRecurringAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedAppointment = await RecurringAppointment.findOneAndUpdate(
      { _id: id, deletedAt: null }, // Buscar cita no eliminada
      { deletedAt: Date.now() }, // Marcar como eliminada
      { new: true }
    );
    if (!deletedAppointment) {
      return res.status(404).json({ status: 'error', message: 'Cita recurrente no encontrada o ya eliminada' });
    }
    res.status(200).json({ status: 'success', message: 'Cita recurrente eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la cita recurrente:', error);
    res.status(500).json({ status: 'error', message: 'Error al eliminar la cita recurrente', error: error.message });
  }
};