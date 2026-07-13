const express = require('express');
const router = express.Router();
const {
  crearCita,
  listarCitas,
  obtenerCita,
  actualizarCita,
  eliminarCita,
  cambiarEstado,
} = require('../controllers/citaController');
const { proteger } = require('../middleware/auth');
const { validarCita } = require('../middleware/validators');


router.use(proteger);

router.route('/')
  .get(listarCitas)
  .post(validarCita, crearCita);

router.patch('/:id/estado', cambiarEstado);

router.route('/:id')
  .get(obtenerCita)
  .put(actualizarCita)
  .delete(eliminarCita);

module.exports = router;
