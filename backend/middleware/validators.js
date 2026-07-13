const { body, validationResult } = require('express-validator');


const validar = (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({
      mensaje: 'Error de validacion',
      errores: errores.array().map((e) => e.msg),
    });
  }
  next();
};

const validarRegistro = [
  body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('El correo no es valido'),
  body('password').isLength({ min: 6 }).withMessage('La contrasena debe tener al menos 6 caracteres'),
  body('rol').optional().isIn(['paciente', 'medico', 'admin']).withMessage('Rol invalido'),
  validar,
];

const validarLogin = [
  body('email').isEmail().withMessage('El correo no es valido'),
  body('password').notEmpty().withMessage('La contrasena es obligatoria'),
  validar,
];

const validarCita = [
  body('paciente').notEmpty().withMessage('El paciente es obligatorio'),
  body('medico').notEmpty().withMessage('El medico es obligatorio'),
  body('especialidad').trim().notEmpty().withMessage('La especialidad es obligatoria'),
  body('fecha').isISO8601().withMessage('La fecha debe tener un formato valido (YYYY-MM-DD)'),
  body('hora').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('La hora debe tener el formato HH:mm'),
  body('motivo').trim().notEmpty().withMessage('El motivo es obligatorio'),
  validar,
];

module.exports = { validarRegistro, validarLogin, validarCita };
