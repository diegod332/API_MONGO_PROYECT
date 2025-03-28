
const Appointment = require('../models/appointmentModel');
const moment = require('moment-timezone');

// Obtener todas las citas
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({})
      .populate('client', 'firstName middleName lastName emergencyNumber')
      .populate('service', 'serviceName');

    // Formatear las fechas antes de enviarlas al frontend
    const formattedAppointments = appointments.map(appointment => ({
      id: appointment._id,
      fullName: appointment.client 
        ? `${appointment.client.firstName} ${appointment.client.middleName || ''} ${appointment.client.lastName}`.trim() 
        : 'Cliente no disponible',
      appointmentDate: moment(appointment.appointmentDate)
        .tz('America/Mexico_City')
        .format('YYYY-MM-DD'), 
      appointmentTime: appointment.appointmentTime,
      service: appointment.service ? appointment.service.serviceName : 'Servicio no disponible',
      client: appointment.client ? appointment.client._id : null,
      status: appointment.status
    }));

    res.status(200).json({ success: true, data: formattedAppointments });
  } catch (error) {
    console.error('Error al obtener citas:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};

// Crear nueva cita
exports.createAppointment = async (req, res) => {
  try {
    let { client, appointmentDate, appointmentTime, service, status } = req.body;

    // Validar que todos los campos requeridos estén presentes
    if (!client || !appointmentDate || !appointmentTime || !service) {
      return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
    }

    // Convertir la fecha al formato correcto (manteniendo la hora)
    appointmentDate = moment.tz(appointmentDate, 'America/Mexico_City').startOf('day').toDate();

    const newAppointment = new Appointment({
      client,
      appointmentDate,
      appointmentTime,
      service,
      status: status || 'pendiente' // Valor por defecto
    });

    await newAppointment.save();
    res.status(201).json({ success: true, message: 'Cita creada exitosamente' });
  } catch (error) {
    console.error('Error al crear cita:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};

// Actualizar una cita
exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    let { client, appointmentDate, appointmentTime, service, status } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: 'El ID de la cita es obligatorio' });
    }

    // Convertir la fecha al formato correcto si viene en la petición
    if (appointmentDate) {
      appointmentDate = moment.tz(appointmentDate, 'America/Mexico_City').startOf('day').toDate();
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { client, appointmentDate, appointmentTime, service, status },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ success: false, message: 'Cita no encontrada' });
    }

    res.status(200).json({ success: true, message: 'Cita actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar cita:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};

// Eliminar una cita
exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: 'El ID de la cita es obligatorio' });
    }

    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({ success: false, message: 'Cita no encontrada' });
    }

    res.status(200).json({ success: true, message: 'Cita eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar cita:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};

// Obtener una cita por ID
exports.getAppointmentById = async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await Appointment.findOne({ _id: id})
      .populate('client', 'firstName middleName lastName')
      .populate('service', 'serviceName');
    if (!appointment) {
      return res.status(404).json({ error: 'Cita no encontrada' });
    }
    res.status(200).json(appointment);
  } catch (error) {
    console.error('Error al obtener la cita:', error);
    res.status(500).json({ error: 'Error al obtener la cita' });
  }
};
