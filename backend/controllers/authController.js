const jwt = require('jsonwebtoken');
const User = require('../models/User');


const DOMINIO_MEDICOS = process.env.DOMINIO_MEDICOS || 'clinica.com';


const generarToken = (usuario) =>
  jwt.sign({ id: usuario._id, rol: usuario.rol }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  });


const respuestaUsuario = (usuario) => ({
  id: usuario._id,
  nombre: usuario.nombre,
  email: usuario.email,
  rol: usuario.rol,
  especialidad: usuario.especialidad,
  telefono: usuario.telefono,
  aprobado: usuario.aprobado,
});


const registrar = async (req, res, next) => {
  try {
    const { nombre, email, password, rol, especialidad, telefono } = req.body;

    const existe = await User.findOne({ email });
    if (existe) {
      return res.status(409).json({ mensaje: 'Ya existe una cuenta registrada con ese correo.' });
    }

    if (rol === 'medico') {
      const correoValido = email?.toLowerCase().trim().endsWith(`@${DOMINIO_MEDICOS}`);
      if (!correoValido) {
        return res.status(400).json({
          mensaje: `Los medicos deben registrarse con un correo institucional (@${DOMINIO_MEDICOS}).`,
        });
      }
    }

    const usuario = await User.create({
      nombre,
      email,
      password,
      rol,
      especialidad,
      telefono,
      
      aprobado: rol === 'medico' ? false : true,
    });

    if (usuario.rol === 'medico') {
      return res.status(201).json({
        mensaje:
          'Cuenta creada correctamente. Un administrador debe aprobar su cuenta antes de que pueda iniciar sesion.',
        usuario: respuestaUsuario(usuario),
      });
    }

    const token = generarToken(usuario);
    return res.status(201).json({ usuario: respuestaUsuario(usuario), token });
  } catch (error) {
    next(error);
  }
};


const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const usuario = await User.findOne({ email }).select('+password');
    if (!usuario || !(await usuario.compararPassword(password))) {
      return res.status(401).json({ mensaje: 'Correo o contrasena incorrectos.' });
    }

    if (!usuario.activo) {
      return res.status(403).json({ mensaje: 'Esta cuenta ha sido desactivada. Contacte al administrador.' });
    }

    if (usuario.rol === 'medico' && usuario.aprobado === false) {
      return res
        .status(403)
        .json({ mensaje: 'Su cuenta de medico aun esta pendiente de aprobacion por un administrador.' });
    }

    const token = generarToken(usuario);
    return res.status(200).json({ usuario: respuestaUsuario(usuario), token });
  } catch (error) {
    next(error);
  }
};


const perfil = async (req, res, next) => {
  try {
    return res.status(200).json({ usuario: respuestaUsuario(req.usuario) });
  } catch (error) {
    next(error);
  }
};


const listarMedicos = async (req, res, next) => {
  try {
    const medicos = await User.find({ rol: 'medico', aprobado: { $ne: false }, activo: true }).select(
      'nombre email especialidad'
    );
    return res.status(200).json({ medicos });
  } catch (error) {
    next(error);
  }
};

const listarPacientes = async (req, res, next) => {
  try {
    const pacientes = await User.find({ rol: 'paciente' }).select('nombre email');
    return res.status(200).json({ pacientes });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  return res.status(200).json({ mensaje: 'Sesion cerrada correctamente.' });
};

module.exports = { registrar, login, perfil, listarMedicos, listarPacientes, logout };
