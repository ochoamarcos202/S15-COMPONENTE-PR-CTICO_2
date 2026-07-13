const User = require('../models/User');


const listarUsuarios = async (req, res, next) => {
  try {
    const usuarios = await User.find().sort({ createdAt: -1 });
    return res.status(200).json({ total: usuarios.length, usuarios });
  } catch (error) {
    next(error);
  }
};

const actualizarUsuario = async (req, res, next) => {
  try {
    const { rol, especialidad, telefono } = req.body;

    
    const cambios = { rol, especialidad, telefono };

    const usuario = await User.findByIdAndUpdate(req.params.id, cambios, {
      new: true,
      runValidators: true,
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    return res.status(200).json({ mensaje: 'Usuario actualizado correctamente', usuario });
  } catch (error) {
    next(error);
  }
};

const cambiarEstadoUsuario = async (req, res, next) => {
  try {
    const { activo } = req.body;

    if (typeof activo !== 'boolean') {
      return res.status(400).json({ mensaje: 'El campo "activo" debe ser true o false' });
    }

    if (req.usuario._id.toString() === req.params.id) {
      return res.status(400).json({ mensaje: 'No puede desactivar su propia cuenta' });
    }

    const usuario = await User.findByIdAndUpdate(req.params.id, { activo }, { new: true });

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    return res.status(200).json({
      mensaje: `Usuario ${activo ? 'activado' : 'desactivado'} correctamente`,
      usuario,
    });
  } catch (error) {
    next(error);
  }
};


const cambiarAprobacion = async (req, res, next) => {
  try {
    const { aprobado } = req.body;

    if (typeof aprobado !== 'boolean') {
      return res.status(400).json({ mensaje: 'El campo "aprobado" debe ser true o false' });
    }

    const usuario = await User.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    if (usuario.rol !== 'medico') {
      return res.status(400).json({ mensaje: 'Solo las cuentas de medico requieren aprobacion' });
    }

    usuario.aprobado = aprobado;
    await usuario.save();

    return res.status(200).json({
      mensaje: `Medico ${aprobado ? 'aprobado' : 'revocado'} correctamente`,
      usuario,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { listarUsuarios, actualizarUsuario, cambiarEstadoUsuario, cambiarAprobacion };
