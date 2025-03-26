const AppointmentService = require('../models/appointmentServiceModel');

exports.getAllAppointmentServices = async (req, res) => {
  try {
    const appointmentServices = await AppointmentService.findAll();
    if (appointmentServices.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No hay servicios de citas disponibles',
      });
    }
    res.status(200).json({ status: 'success', data: appointmentServices });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener los servicios de citas', error: error.message });
  }
};

exports.getAppointmentServiceById = async (req, res) => {
  const { appointment_id, service_id } = req.params;

  try {
    const appointmentService = await AppointmentService.findOne(appointment_id, service_id);
    if (!appointmentService) {
      return res.status(404).json({ message: 'No se encontró la combinación de cita y servicio' });
    }
    return res.status(200).json(appointmentService);
  } catch (error) {
    console.error('Error al obtener la relación de cita y servicio:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.createAppointmentService = async (req, res) => {
  const { appointment_id, service_id } = req.body;

  if (!appointment_id || !service_id) {
    return res.status(400).json({ status: 'error', message: 'Faltan datos requeridos para crear un servicio de cita' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const newAppointmentService = await AppointmentService.create(req.body, client);
    await client.query('COMMIT');
    res.status(201).json({ status: 'success', data: newAppointmentService });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ status: 'error', message: 'Error al crear el servicio de cita', error: error.message });
  } finally {
    client.release();
  }
};

exports.updateAppointmentService = async (req, res) => {
  const { appointment_id, service_id } = req.params;
  const { new_service_id } = req.body;

  if (!new_service_id) {
    return res.status(400).json({
      status: 'error',
      message: 'Faltan datos requeridos para actualizar el servicio de cita',
    });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const updatedAppointmentService = await AppointmentService.update(appointment_id, service_id, { new_service_id }, client);

    if (!updatedAppointmentService) {
      return res.status(404).json({
        status: 'error',
        message: 'No se encontró la relación de cita y servicio',
      });
    }

    await client.query('COMMIT');
    res.status(200).json({ status: 'success', data: updatedAppointmentService });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar el servicio de cita',
      error: error.message,
    });
  } finally {
    client.release();
  }
};

exports.deleteAppointmentService = async (req, res) => {
  const { appointment_id, service_id } = req.params;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const response = await AppointmentService.delete(appointment_id, service_id, client);
    await client.query('COMMIT');

    if (response.message.includes('no existe o ya ha sido eliminada')) {
      return res.status(404).json({ status: 'error', message: response.message });
    }

    res.status(204).send(); 
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(500).json({ status: 'error', message: 'Error al eliminar el servicio de cita', error: error.message });
  } finally {
    client.release();
  }
};