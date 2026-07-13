const express = require('express');
const router = express.Router();
const {
  listarUsuarios,
  actualizarUsuario,
  cambiarEstadoUsuario,
  cambiarAprobacion,
} = require('../controllers/userController');
const { proteger, autorizar } = require('../middleware/auth');

router.use(proteger, autorizar('admin'));

router.get('/', listarUsuarios);
router.put('/:id', actualizarUsuario);
router.patch('/:id/estado', cambiarEstadoUsuario);
router.patch('/:id/aprobar', cambiarAprobacion);

module.exports = router;
