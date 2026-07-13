import { useEffect, useState } from 'react';
import api from '../services/api';


const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarUsuarios = async () => {
    setCargando(true);
    try {
      const { data } = await api.get('/usuarios');
      setUsuarios(data.usuarios);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No fue posible cargar los usuarios.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const manejarCambioRol = async (id, rol) => {
    try {
      await api.put(`/usuarios/${id}`, { rol });
      cargarUsuarios();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No fue posible cambiar el rol.');
    }
  };

  const manejarCambioEstado = async (id, activo) => {
    try {
      await api.patch(`/usuarios/${id}/estado`, { activo });
      cargarUsuarios();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No fue posible cambiar el estado del usuario.');
    }
  };

  const manejarAprobacion = async (id, aprobado) => {
    try {
      await api.patch(`/usuarios/${id}/aprobar`, { aprobado });
      cargarUsuarios();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No fue posible actualizar la aprobacion.');
    }
  };

  if (cargando) return <p className="contenedor-pagina">Cargando usuarios...</p>;

  return (
    <div className="contenedor-pagina">
      <h1>Administracion de usuarios</h1>
      {error && <p className="mensaje-error">{error}</p>}

      <table className="tabla-citas">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Especialidad</th>
            <th>Estado</th>
            <th>Aprobacion</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u._id}>
              <td>{u.nombre}</td>
              <td>{u.email}</td>
              <td>
                <select value={u.rol} onChange={(e) => manejarCambioRol(u._id, e.target.value)}>
                  <option value="paciente">Paciente</option>
                  <option value="medico">Medico</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>{u.especialidad || '-'}</td>
              <td>
                <span className={u.activo ? 'estado estado-confirmada' : 'estado estado-cancelada'}>
                  {u.activo ? 'Activo' : 'Desactivado'}
                </span>
              </td>
              <td>
                {u.rol === 'medico' ? (
                  <span className={u.aprobado ? 'estado estado-confirmada' : 'estado estado-pendiente'}>
                    {u.aprobado ? 'Aprobado' : 'Pendiente'}
                  </span>
                ) : (
                  '-'
                )}
              </td>
              <td className="acciones-tabla">
                {u.rol === 'medico' && (
                  <button
                    className="btn btn-pequeno"
                    onClick={() => manejarAprobacion(u._id, !u.aprobado)}
                  >
                    {u.aprobado ? 'Revocar' : 'Aprobar'}
                  </button>
                )}
                <button
                  className="btn btn-pequeno btn-peligro"
                  onClick={() => manejarCambioEstado(u._id, !u.activo)}
                >
                  {u.activo ? 'Desactivar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Usuarios;
