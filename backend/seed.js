require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Cita = require('./models/Cita');


const seed = async () => {
  await connectDB();

  await User.deleteMany({});
  await Cita.deleteMany({});

  const admin = await User.create({
    nombre: 'Administrador General',
    email: 'admin@clinica.com',
    password: 'admin123',
    rol: 'admin',
  });

  const medico = await User.create({
    nombre: 'Dra. Ana Torres',
    email: 'ana.torres@clinica.com',
    password: 'medico123',
    rol: 'medico',
    especialidad: 'Cardiologia',
  });

  const paciente = await User.create({
    nombre: 'Carlos Ramirez',
    email: 'carlos@correo.com',
    password: 'paciente123',
    rol: 'paciente',
    telefono: '0991234567',
  });

  await Cita.create({
    paciente: paciente._id,
    medico: medico._id,
    especialidad: 'Cardiologia',
    fecha: new Date('2026-07-20'),
    hora: '09:30',
    motivo: 'Control anual de presion arterial',
    estado: 'pendiente',
  });

  console.log('Datos de prueba insertados correctamente:');
  console.log('Admin -> admin@clinica.com / admin123');
  console.log('Medico -> ana.torres@clinica.com / medico123');
  console.log('Paciente -> carlos@correo.com / paciente123');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
