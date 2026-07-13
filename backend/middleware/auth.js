const jwt = require('jsonwebtoken');
const User = require('../models/User');


const proteger = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ mensaje: 'No autorizado. Token no proporcionado.' });
    }

    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const usuario = await User.findById(payload.id);
    if (!usuario) {
      return res.status(401).json({ mensaje: 'El usuario asociado al token ya no existe.' });
    }

    if (!usuario.activo) {
      return res.status(403).json({ mensaje: 'Esta cuenta ha sido desactivada.' });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token invalido o expirado.' });
  }
};


const autorizar = (...rolesPermitidos) => (req, res, next) => {
  if (!rolesPermitidos.includes(req.usuario.rol)) {
    return res.status(403).json({ mensaje: 'No tiene permisos para realizar esta accion.' });
  }
  next();
};

module.exports = { proteger, autorizar };
