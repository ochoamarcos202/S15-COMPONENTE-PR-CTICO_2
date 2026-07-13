import { useEffect, useState } from 'react';
import api from '../services/api';


const CitaForm = ({ citaActual, onGuardado, onCancelar, usuario }) => {
  const [medicos, setMedicos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [formulario, setFormulario] = useState({
    paciente: usuario?.rol === 'paciente' ? usuario.id : '',
    medico: '',
    especialidad: '',
    fecha: '',
    hora: '',
    motivo: '',
    notas: '',
  });
  const [errores, setErrores] = useState([]);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resMedicos = await api.get('/auth/medicos');
        setMedicos(resMedicos.data.medicos);

        
        if (usuario?.rol !== 'paciente') {
          const resPacientes = await api.get('/auth/pacientes');
          setPacientes(resPacientes.data.pacientes);
        }
      } catch (error) {
        console.error('No fue posible cargar los datos del formulario', error);
      }
    };
    cargarDatos();
  }, [usuario?.rol]);

  useEffect(() => {
    if (citaActual) {
      setFormulario({
        paciente: citaActual.paciente?._id || citaActual.paciente,
        medico: citaActual.medico?._id || citaActual.medico,
        especialidad: citaActual.especialidad,
        fecha: citaActual.fecha?.slice(0, 10),
        hora: citaActual.hora,
        motivo: citaActual.motivo,
        notas: citaActual.notas || '',
      });
    }
  }, [citaActual]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({ ...prev, [name]: value }));
  };

  
  const manejarCambioMedico = (e) => {
    const medicoId = e.target.value;
    const medicoSeleccionado = medicos.find((m) => m._id === medicoId);
    setFormulario((prev) => ({
      ...prev,
      medico: medicoId,
      especialidad: medicoSeleccionado ? medicoSeleccionado.especialidad : '',
    }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setErrores([]);
    setEnviando(true);
    try {
      if (citaActual) {
        await api.put(`/citas/${citaActual._id}`, formulario);
      } else {
        await api.post('/citas', formulario);
      }
      onGuardado();
    } catch (error) {
      const mensajes = error.response?.data?.errores || [
        error.response?.data?.mensaje || 'Ocurrio un error al guardar la cita',
      ];
      setErrores(mensajes);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form className="formulario" onSubmit={manejarEnvio}>
      <h3>{citaActual ? 'Editar cita' : 'Nueva cita'}</h3>

      {errores.length > 0 && (
        <ul className="lista-errores">
          {errores.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}

      {usuario?.rol !== 'paciente' && (
        <div className="campo">
          <label>Paciente</label>
          <select name="paciente" value={formulario.paciente} onChange={manejarCambio} required>
            <option value="">Seleccione un paciente</option>
            {pacientes.map((p) => (
              <option key={p._id} value={p._id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="campo">
        <label>Medico</label>
        <select name="medico" value={formulario.medico} onChange={manejarCambioMedico} required>
          <option value="">Seleccione un medico</option>
          {medicos.map((m) => (
            <option key={m._id} value={m._id}>
              {m.nombre} - {m.especialidad}
            </option>
          ))}
        </select>
      </div>

      <div className="campo">
        <label>Especialidad</label>
        <input
          type="text"
          name="especialidad"
          value={formulario.especialidad}
          disabled
          placeholder="Se completa automaticamente al elegir el medico"
          required
        />
      </div>

      <div className="campo-fila">
        <div className="campo">
          <label>Fecha</label>
          <input type="date" name="fecha" value={formulario.fecha} onChange={manejarCambio} required />
        </div>
        <div className="campo">
          <label>Hora</label>
          <input type="time" name="hora" value={formulario.hora} onChange={manejarCambio} required />
        </div>
      </div>

      <div className="campo">
        <label>Motivo de la consulta</label>
        <textarea name="motivo" value={formulario.motivo} onChange={manejarCambio} required />
      </div>

      <div className="campo">
        <label>Notas adicionales</label>
        <textarea name="notas" value={formulario.notas} onChange={manejarCambio} />
      </div>

      <div className="acciones-formulario">
        <button type="submit" className="btn btn-primario" disabled={enviando}>
          {enviando ? 'Guardando...' : 'Guardar'}
        </button>
        <button type="button" className="btn btn-secundario" onClick={onCancelar}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default CitaForm;
