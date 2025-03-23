const Service = require('../models/serviceModel');

// Obtener todos los servicios
exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ deletedAt: null }); // Filtrar servicios no eliminados
    if (services.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No hay servicios disponibles' });
    }
    res.status(200).json({ status: 'success', data: services });
  } catch (error) {
    console.error('Error al obtener los servicios:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener los servicios', error: error.message });
  }
};

// Obtener servicios para dropdown
exports.getServicesForDropdown = async (req, res) => {
    try {
      const services = await Service.find({ deletedAt: null }).select('serviceName price');
      const formattedServices = services.map(service => ({
        id: service._id,
        name: service.serviceName,
        price: service.price,
      }));
      res.status(200).json({ status: 'success', data: formattedServices });
    } catch (error) {
      console.error('Error al obtener los servicios:', error);
      res.status(500).json({ status: 'error', message: 'Error al obtener los servicios', error: error.message });
    }
  };

// Obtener servicios por ID o consulta
exports.getServicesByQueryOrId = async (req, res) => {
  const query = req.params.query;

  try {
    // Validar si el query es un ID válido
    if (mongoose.Types.ObjectId.isValid(query)) {
      const service = await Service.findOne({ _id: query, deletedAt: null });
      if (!service) {
        return res.status(404).json({ status: 'error', message: 'Servicio no encontrado' });
      }
      return res.status(200).json({ status: 'success', data: service });
    }

    // Validar si el query es un texto
    const services = await Service.find({
      $or: [
        { serviceName: { $regex: query, $options: 'i' } },
        { price: { $regex: query, $options: 'i' } },
      ],
      deletedAt: null,
    });

    if (services.length === 0) {
      return res.status(404).json({ status: 'error', message: 'No se encontraron coincidencias' });
    }

    res.status(200).json({ status: 'success', data: services });
  } catch (error) {
    console.error('Error al buscar servicios:', error);
    res.status(500).json({ status: 'error', message: 'Error al realizar la búsqueda', error: error.message });
  }
};


// Crear un nuevo servicio
exports.createService = async (req, res) => {
  const { serviceName, price } = req.body;

  // Validar campos requeridos
  if (!serviceName || typeof serviceName !== 'string' || serviceName.trim() === '') {
    return res.status(400).json({ status: 'error', message: 'El nombre del servicio es obligatorio y debe ser un texto válido' });
  }

  if (!price || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ status: 'error', message: 'El precio es obligatorio y debe ser un número mayor a 0' });
  }

  try {
    const newService = new Service({ serviceName, price });
    const savedService = await newService.save();
    res.status(201).json({ status: 'success', data: savedService });
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(500).json({ status: 'error', message: 'Error al crear servicio', error: error.message });
  }
};

// Actualizar un servicio
exports.updateService = async (req, res) => {
  const { serviceName, price } = req.body;

  // Validar campos requeridos
  if (!serviceName || typeof serviceName !== 'string' || serviceName.trim() === '') {
    return res.status(400).json({ status: 'error', message: 'El nombre del servicio es obligatorio y debe ser un texto válido' });
  }

  if (!price || typeof price !== 'number' || price <= 0) {
    return res.status(400).json({ status: 'error', message: 'El precio es obligatorio y debe ser un número mayor a 0' });
  }

  try {
    const updatedService = await Service.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null }, // Buscar servicio no eliminado
      { serviceName, price, updatedAt: Date.now() },
      { new: true } // Retornar el servicio actualizado
    );

    if (!updatedService) {
      return res.status(404).json({ status: 'error', message: 'Servicio no encontrado o ya eliminado' });
    }

    res.status(200).json({ status: 'success', data: updatedService });
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.status(500).json({ status: 'error', message: 'Error al actualizar servicio', error: error.message });
  }
};

// Eliminar un servicio (eliminación lógica)
exports.deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findOneAndUpdate(
      { _id: req.params.id, deletedAt: null }, // Buscar servicio no eliminado
      { deletedAt: Date.now() }, // Marcar como eliminado
      { new: true }
    );

    if (!deletedService) {
      return res.status(404).json({ status: 'error', message: 'Servicio no encontrado o ya eliminado' });
    }

    res.status(200).json({ status: 'success', message: 'Servicio eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    res.status(500).json({ status: 'error', message: 'Error al eliminar servicio', error: error.message });
  }
};