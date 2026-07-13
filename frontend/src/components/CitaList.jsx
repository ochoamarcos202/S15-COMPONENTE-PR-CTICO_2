import { Fragment } from 'react';


const etiquetasEstado = {
  pendiente: 'estado estado-pendiente',
  confirmada: 'estado estado-confirmada',
  cancelada: 'estado estado-cancelada',
  atendida: 'estado estado-atendida',
};


const opcionesEstadoPorRol = {
  medico: ['pendiente', 'confirmada', 'atendida', 'cancelada'],
  admin: ['pendiente', 'confirmada', 'atendida', 'cancelada'],
};

const CitaList = ({ citas, onEditar, onEliminar, onCambiarEstado, onVerHistorial, historiales, usuario }) => {
  if (!citas.length) {
    return <p className="mensaje-vacio">No hay citas registradas todavia.</p>;
  }

  const opcionesEstado = opcionesEstadoPorRol[usuario?.rol];

  return (
    <table className="tabla-citas">
      <thead>
        <tr>
          <th>Paciente</th>
          <th>Medico</th>
          <th>Especialidad</th>
          <th>Fecha</th>
          <th>Hora</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {citas.map((cita) => {
          const historial = historiales?.[cita._id];

          return (
            <Fragment key={cita._id}>
              <tr>
                <td>{cita.paciente?.nombre || '-'}</td>
                <td>{cita.medico?.nombre || '-'}</td>
                <td>{cita.especialidad}</td>
                <td>{new Date(cita.fecha).toLocaleDateString('es-EC')}</td>
                <td>{cita.hora}</td>
                <td>
                  {opcionesEstado ? (
                    
                    <select
                      className={etiquetasEstado[cita.estado]}
                      value={cita.estado}
                      onChange={(e) => onCambiarEstado(cita._id, e.target.value)}
                    >
                      {opcionesEstado.map((op) => (
                        <option key={op} value={op}>
                          {op}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className={etiquetasEstado[cita.estado]}>{cita.estado}</span>
                  )}
                </td>
                <td className="acciones-tabla">
                  <button className="btn btn-pequeno" onClick={() => onEditar(cita)}>
                    Editar
                  </button>

                  <button className="btn btn-pequeno" onClick={() => onVerHistorial(cita._id)}>
                    {historial ? 'Ocultar historial' : 'Ver historial'}
                  </button>

                  {usuario?.rol === 'paciente' &&
                    cita.estado !== 'cancelada' &&
                    cita.estado !== 'atendida' && (
                      <button
                        className="btn btn-pequeno btn-peligro"
                        onClick={() => onCambiarEstado(cita._id, 'cancelada')}
                      >
                        Cancelar cita
                      </button>
                    )}

                  {usuario?.rol !== 'paciente' && (
                    <button className="btn btn-pequeno btn-peligro" onClick={() => onEliminar(cita._id)}>
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>

              {historial && (
                <tr key={`${cita._id}-historial`}>
                  <td colSpan={7}>
                    <div className="panel-historial">
                      <strong>Historial de estados:</strong>
                      <ul>
                        {historial.map((h, i) => (
                          <li key={i}>
                            <span className={etiquetasEstado[h.estado]}>{h.estado}</span>
                            {' — '}
                            {h.cambiadoPor?.nombre || 'Sistema'} ({h.cambiadoPor?.rol || '-'}) el{' '}
                            {new Date(h.fecha).toLocaleString('es-EC')}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export default CitaList;
