const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'El correo no tiene un formato valido'],
    },
    password: {
      type: String,
      required: [true, 'La contrasena es obligatoria'],
      minlength: [6, 'La contrasena debe tener al menos 6 caracteres'],
      select: false,
    },
    rol: {
      type: String,
      enum: ['paciente', 'medico', 'admin'],
      default: 'paciente',
    },
    especialidad: {
      
      type: String,
      trim: true,
      default: null,
    },
    telefono: {
      type: String,
      trim: true,
      default: null,
    },
    activo: {
      type: Boolean,
      default: true,
    },
    aprobado: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.compararPassword = async function compararPassword(passwordIngresado) {
  return bcrypt.compare(passwordIngresado, this.password);
};

module.exports = mongoose.model('User', userSchema);
