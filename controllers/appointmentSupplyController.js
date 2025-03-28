const AppointmentSupply = require('../models/appointmentSupplyModel');

exports.getAllAppointmentSupplies = async (req, res) => {
  try {
    const appointmentSupplies = await AppointmentSupply.find({})
      .populate('appointment', 'appointmentDate appointmentTime')
      .populate('supply', 'name quantity');
    if (appointmentSupplies.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No hay suministros de citas disponibles',
      });
    }
    res.status(200).json({ status: 'success', data: appointmentSupplies });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al obtener los suministros de citas', error: error.message });
  }
};

exports.getAppointmentSupplyById = async (req, res) => {
  const { appointment_id, supply_id } = req.params;

  try {
    const appointmentSupply = await AppointmentSupply.findOne({
      appointment: appointment_id,
      supply: supply_id,
    })
      .populate('appointment', 'appointmentDate appointmentTime')
      .populate('supply', 'name quantity');
    if (!appointmentSupply) {
      return res.status(404).json({ message: 'No se encontró la relación de cita y suministro' });
    }
    res.status(200).json({ status: 'success', data: appointmentSupply });
  } catch (error) {
    console.error('Error al obtener la relación de cita y suministro:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

exports.createAppointmentSupply = async (req, res) => {
  const { appointment_id, supply_id, quantityUsed } = req.body;

  if (!appointment_id || !supply_id || !quantityUsed) {
    return res.status(400).json({ status: 'error', message: 'Faltan datos requeridos para crear un suministro de cita' });
  }

  try {
    const newAppointmentSupply = new AppointmentSupply({
      appointment: appointment_id,
      supply: supply_id,
      quantityUsed,
    });
    const savedAppointmentSupply = await newAppointmentSupply.save();
    res.status(201).json({ status: 'success', data: savedAppointmentSupply });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al crear el suministro de cita', error: error.message });
  }
};

exports.updateAppointmentSupply = async (req, res) => {
  const { appointment_id, supply_id } = req.params;
  const { quantityUsed } = req.body;

  if (!quantityUsed) {
    return res.status(400).json({
      status: 'error',
      message: 'Faltan datos requeridos para actualizar el suministro de cita',
    });
  }

  try {
    const updatedAppointmentSupply = await AppointmentSupply.findOneAndUpdate(
      { appointment: appointment_id, supply: supply_id},
      { quantityUsed, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedAppointmentSupply) {
      return res.status(404).json({
        status: 'error',
        message: 'No se encontró la relación de cita y suministro',
      });
    }

    res.status(200).json({ status: 'success', data: updatedAppointmentSupply });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar el suministro de cita',
      error: error.message,
    });
  }
};

exports.deleteAppointmentSupply = async (req, res) => {
  const { appointment_id, supply_id } = req.params;

  try {
    const deletedAppointmentSupply = await AppointmentSupply.findOneAndUpdate(
      { appointment: appointment_id, supply: supply_id},
      { deletedAt: Date.now() },
      { new: true }
    );

    if (!deletedAppointmentSupply) {
      return res.status(404).json({
        status: 'error',
        message: 'No se encontró la relación de cita y suministro o ya fue eliminada',
      });
    }

    res.status(200).json({ status: 'success', message: 'Relación eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al eliminar el suministro de cita', error: error.message });
  }
};