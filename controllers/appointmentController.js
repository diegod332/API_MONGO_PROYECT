const Appointment = require('../models/appointmentModel');

// Obtener todas las citas
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ deletedAt: null })
      .populate('client', 'firstName middleName lastName emergencyNumber') // Poblar datos del cliente
      .populate('services', 'serviceName'); // Poblar datos de los servicios

    // Formatear los datos para devolverlos en el formato requerido
    const formattedAppointments = appointments.map((appointment) => ({
      id: appointment._id,
      fullName: `${appointment.client.firstName} ${appointment.client.middleName} ${appointment.client.lastName}`,
      emergencyNumber: appointment.client.emergencyNumber, // Incluir emergencyNumber
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      service: appointment.services.map((service) => service.serviceName).join(', '), // Si hay múltiples servicios
      status: appointment.status,
    }));

    res.status(200).json({ status: 'success', data: formattedAppointments });
  } catch (error) {
    console.error('Error al obtener las citas:', error);
    res.status(500).json({ error: 'Error al obtener las citas' });
  }
};

// Obtener una cita por ID
exports.getAppointmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findOne({ _id: id, deletedAt: null })
      .populate('client', 'firstName middleName lastName')
      .populate('services', 'serviceName');
    if (!appointment) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error al obtener la cita:', error);
    res.status(500).json({ error: 'Error al obtener la cita' });
  }
};

exports.createAppointment = async (req, res) => {
  const { appointmentDate, appointmentTime, client, status, services } = req.body;

  // Validar campos requeridos
  if (!appointmentDate || isNaN(Date.parse(appointmentDate))) {
    return res.status(400).json({ error: 'La fecha de la cita es obligatoria y debe ser válida' });
  }
  if (!appointmentTime || typeof appointmentTime !== 'string' || appointmentTime.trim() === '') {
    return res.status(400).json({ error: 'La hora de la cita es obligatoria y debe ser un texto válido' });
  }
  if (!client || typeof client !== 'string' || client.trim() === '') {
    return res.status(400).json({ error: 'El cliente es obligatorio y debe ser un ID válido' });
  }
  if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'El estado debe ser "pending", "confirmed" o "cancelled"' });
  }

  try {
    const newAppointment = new Appointment({
      appointmentDate,
      appointmentTime,
      client,
      status,
      services,
    });
    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    console.error('Error al crear la cita:', error);
    res.status(500).json({ error: 'Error al crear la cita' });
  }
};

// Actualizar una cita

exports.updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { appointmentDate, appointmentTime, client, status, services } = req.body;

  try {
    const updatedAppointment = await Appointment.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { appointmentDate, appointmentTime, client, status, services, updatedAt: Date.now() },
      { new: true }
    );
    if (!updatedAppointment) {
      return res.status(404).json({ error: 'Cita no encontrada o ya eliminada' });
    }
    res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error('Error al actualizar la cita:', error);
    res.status(500).json({ error: 'Error al actualizar la cita' });
  }
};

// Eliminar una cita (eliminación lógica)
exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedAppointment = await Appointment.findOneAndUpdate(
      { _id: id, deletedAt: null },
      { deletedAt: Date.now() },
      { new: true }
    );
    if (!deletedAppointment) {
      return res.status(404).json({ error: 'Cita no encontrada o ya eliminada' });
    }
    res.status(200).json({ message: 'Cita eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la cita:', error);
    res.status(500).json({ error: 'Error al eliminar la cita' });
  }
};