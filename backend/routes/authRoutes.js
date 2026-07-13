const express = require('express');
const router = express.Router();
const { registrar, login, perfil, listarMedicos, listarPacientes, logout } = require('../controllers/authController');
const { proteger } = require('../middleware/auth');
const { validarRegistro, validarLogin } = require('../middleware/validators');


router.post('/registro', validarRegistro, registrar);
router.post('/login', validarLogin, login);


router.get('/perfil', proteger, perfil);
router.get('/medicos', proteger, listarMedicos);
router.get('/pacientes', proteger, listarPacientes);
router.post('/logout', proteger, logout);

module.exports = router;
