const Cita = require('../models/Cita');

const obtenerIdComoTexto = (valor) => {
  if (!valor) return null;
  return valor._id ? valor._id.toString() : valor.toString();
};


const puedeAccederCita = (usuario, cita) => {
  if (usuario.rol === 'admin') return true;
  if (usuario.rol === 'paciente') return obtenerIdComoTexto(cita.paciente) === usuario._id.toString();
  if (usuario.rol === 'medico') return obtenerIdComoTexto(cita.medico) === usuario._id.toString();
  return false;
};


const ESTADOS_PERMITIDOS_POR_ROL = {
  paciente: ['cancelada'],
  medico: ['confirmada', 'atendida', 'cancelada'],
  admin: ['pendiente', 'confirmada', 'atendida', 'cancelada'],
};

const POBLAR_CITA = [
  { path: 'paciente', select: 'nombre email telefono' },
  { path: 'medico', select: 'nombre especialidad' },
  { path: 'historial.cambiadoPor', select: 'nombre rol' },
];

const crearCita = async (req, res, next) => {
  try {
    const { paciente, medico, especialidad, fecha, hora, motivo, notas } = req.body;

    const cita = await Cita.create({
      paciente,
      medico,
      especialidad,
      fecha,
      hora,
      motivo,
      notas,
      historial: [{ estado: 'pendiente', cambiadoPor: req.usuario._id }],
    });

    const citaPoblada = await cita.populate(POBLAR_CITA);

    return res.status(201).json({ mensaje: 'Cita creada correctamente', cita: citaPoblada });
  } catch (error) {
    next(error);
  }
};

const listarCitas = async (req, res, next) => {
  try {
    const filtro = {};

    if (req.usuario.rol === 'paciente') filtro.paciente = req.usuario._id;
    if (req.usuario.rol === 'medico') filtro.medico = req.usuario._id;

    if (req.query.estado) filtro.estado = req.query.estado;

    const citas = await Cita.find(filtro)
      .populate('paciente', 'nombre email telefono')
      .populate('medico', 'nombre especialidad')
      .sort({ fecha: 1, hora: 1 });

    return res.status(200).json({ total: citas.length, citas });
  } catch (error) {
    next(error);
  }
};

const obtenerCita = async (req, res, next) => {
  try {
    const cita = await Cita.findById(req.params.id).populate(POBLAR_CITA);

    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }

    if (!puedeAccederCita(req.usuario, cita)) {
      return res.status(403).json({ mensaje: 'No tiene permiso para ver esta cita' });
    }

    return res.status(200).json({ cita });
  } catch (error) {
    next(error);
  }
};

const actualizarCita = async (req, res, next) => {
  try {
    const citaExistente = await Cita.findById(req.params.id);
    if (!citaExistente) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }

    if (!puedeAccederCita(req.usuario, citaExistente)) {
      return res.status(403).json({ mensaje: 'No tiene permiso para modificar esta cita' });
    }

    if (req.usuario.rol === 'paciente') {
      delete req.body.paciente;
      delete req.body.estado;
    }

    const cita = await Cita.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate(POBLAR_CITA);

    return res.status(200).json({ mensaje: 'Cita actualizada correctamente', cita });
  } catch (error) {
    next(error);
  }
};

const eliminarCita = async (req, res, next) => {
  try {
    const cita = await Cita.findById(req.params.id);
    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }

    if (!puedeAccederCita(req.usuario, cita)) {
      return res.status(403).json({ mensaje: 'No tiene permiso para eliminar esta cita' });
    }

    await cita.deleteOne();
    return res.status(200).json({ mensaje: 'Cita eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

const cambiarEstado = async (req, res, next) => {
  try {
    const { estado } = req.body;
    const permitidos = ESTADOS_PERMITIDOS_POR_ROL[req.usuario.rol] || [];

    if (!estado || !permitidos.includes(estado)) {
      return res.status(400).json({
        mensaje: `Su rol (${req.usuario.rol}) no puede cambiar el estado a "${estado}"`,
      });
    }

    const cita = await Cita.findById(req.params.id);
    if (!cita) {
      return res.status(404).json({ mensaje: 'Cita no encontrada' });
    }

    if (!puedeAccederCita(req.usuario, cita)) {
      return res.status(403).json({ mensaje: 'No tiene permiso sobre esta cita' });
    }

    cita.estado = estado;
    cita.historial.push({ estado, cambiadoPor: req.usuario._id });
    await cita.save();

    const citaPoblada = await cita.populate(POBLAR_CITA);

    return res.status(200).json({ mensaje: 'Estado actualizado correctamente', cita: citaPoblada });
  } catch (error) {
    next(error);
  }
};

module.exports = { crearCita, listarCitas, obtenerCita, actualizarCita, eliminarCita, cambiarEstado };
