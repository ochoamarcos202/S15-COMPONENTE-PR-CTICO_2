require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const citaRoutes = require('./routes/citaRoutes');
const userRoutes = require('./routes/userRoutes');
const { errorHandler, rutaNoEncontrada } = require('./middleware/errorHandler');


connectDB();

const app = express();


app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => res.status(200).json({ estado: 'API funcionando correctamente' }));
app.use('/api/auth', authRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/usuarios', userRoutes);

app.use(rutaNoEncontrada);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
