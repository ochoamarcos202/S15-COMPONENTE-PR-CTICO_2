const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema(
  {
    paciente: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'La cita debe tener un paciente asociado'],
    },
    medico: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'La cita debe tener un medico asociado'],
    },
    especialidad: {
      type: String,
      required: [true, 'La especialidad es obligatoria'],
      trim: true,
    },
    fecha: {
      type: Date,
      required: [true, 'La fecha de la cita es obligatoria'],
    },
    hora: {
      type: String,
      required: [true, 'La hora de la cita es obligatoria'],
      match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'La hora debe tener el formato HH:mm'],
    },
    motivo: {
      type: String,
      required: [true, 'El motivo de la consulta es obligatorio'],
      trim: true,
      maxlength: 300,
    },
    estado: {
      type: String,
      enum: ['pendiente', 'confirmada', 'cancelada', 'atendida'],
      default: 'pendiente',
    },
    notas: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    
    historial: [
      {
        estado: {
          type: String,
          enum: ['pendiente', 'confirmada', 'cancelada', 'atendida'],
          required: true,
        },
        cambiadoPor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        fecha: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

citaSchema.index({ medico: 1, fecha: 1, hora: 1 }, { unique: true });

module.exports = mongoose.model('Cita', citaSchema);
