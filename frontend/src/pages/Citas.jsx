import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import CitaForm from '../components/CitaForm';
import CitaList from '../components/CitaList';


const Citas = () => {
  const { usuario } = useAuth();
  const [citas, setCitas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [citaEnEdicion, setCitaEnEdicion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [historiales, setHistoriales] = useState({});

  const cargarCitas = async () => {
    setCargando(true);
    try {
      const { data } = await api.get('/citas');
      setCitas(data.citas);
    } catch (err) {
      setError('No fue posible cargar las citas.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCitas();
  }, []);

  const manejarNuevaCita = () => {
    setCitaEnEdicion(null);
    setMostrarFormulario(true);
  };

  const manejarEditar = (cita) => {
    setCitaEnEdicion(cita);
    setMostrarFormulario(true);
  };

  const manejarEliminar = async (id) => {
    if (!window.confirm('Esta seguro de eliminar esta cita?')) return;
    try {
      await api.delete(`/citas/${id}`);
      cargarCitas();
    } catch (err) {
      setError('No fue posible eliminar la cita.');
    }
  };

  const manejarGuardado = () => {
    setMostrarFormulario(false);
    cargarCitas();
  };

  const manejarCambiarEstado = async (id, estado) => {
    try {
      await api.patch(`/citas/${id}/estado`, { estado });
      cargarCitas();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No fue posible cambiar el estado de la cita.');
    }
  };

  
  const manejarVerHistorial = async (id) => {
    if (historiales[id]) {
      setHistoriales((prev) => {
        const copia = { ...prev };
        delete copia[id];
        return copia;
      });
      return;
    }

    try {
      const { data } = await api.get(`/citas/${id}`);
      setHistoriales((prev) => ({ ...prev, [id]: data.cita.historial }));
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No fue posible cargar el historial.');
    }
  };

  return (
    <div className="contenedor-pagina">
      <div className="encabezado-pagina">
        <h1>Mis Citas Medicas</h1>
        {!mostrarFormulario && (
          <button className="btn btn-primario" onClick={manejarNuevaCita}>
            + Nueva cita
          </button>
        )}
      </div>

      {error && <p className="mensaje-error">{error}</p>}

      {mostrarFormulario ? (
        <CitaForm
          citaActual={citaEnEdicion}
          usuario={usuario}
          onGuardado={manejarGuardado}
          onCancelar={() => setMostrarFormulario(false)}
        />
      ) : cargando ? (
        <p>Cargando citas...</p>
      ) : (
        <CitaList
          citas={citas}
          onEditar={manejarEditar}
          onEliminar={manejarEliminar}
          onCambiarEstado={manejarCambiarEstado}
          onVerHistorial={manejarVerHistorial}
          historiales={historiales}
          usuario={usuario}
        />
      )}
    </div>
  );
};

export default Citas;
