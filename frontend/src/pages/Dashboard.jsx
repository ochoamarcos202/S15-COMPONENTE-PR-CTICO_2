import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';


const Dashboard = () => {
  const { usuario } = useAuth();
  const [resumen, setResumen] = useState({ total: 0, pendiente: 0, confirmada: 0, atendida: 0, cancelada: 0 });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarResumen = async () => {
      try {
        const { data } = await api.get('/citas');
        const citas = data.citas;
        setResumen({
          total: citas.length,
          pendiente: citas.filter((c) => c.estado === 'pendiente').length,
          confirmada: citas.filter((c) => c.estado === 'confirmada').length,
          atendida: citas.filter((c) => c.estado === 'atendida').length,
          cancelada: citas.filter((c) => c.estado === 'cancelada').length,
        });
      } catch (error) {
        console.error('No fue posible cargar el resumen', error);
      } finally {
        setCargando(false);
      }
    };
    cargarResumen();
  }, []);

  return (
    <div className="contenedor-pagina">
      <h1>Bienvenido, {usuario?.nombre}</h1>
      <p className="subtitulo">Rol: {usuario?.rol}</p>

      {cargando ? (
        <p>Cargando resumen...</p>
      ) : (
        <div className="tarjetas-resumen">
          <div className="tarjeta">
            <span className="tarjeta-numero">{resumen.total}</span>
            <span>Total de citas</span>
          </div>
          <div className="tarjeta">
            <span className="tarjeta-numero">{resumen.pendiente}</span>
            <span>Pendientes</span>
          </div>
          <div className="tarjeta">
            <span className="tarjeta-numero">{resumen.confirmada}</span>
            <span>Confirmadas</span>
          </div>
          <div className="tarjeta">
            <span className="tarjeta-numero">{resumen.atendida}</span>
            <span>Atendidas</span>
          </div>
          <div className="tarjeta">
            <span className="tarjeta-numero">{resumen.cancelada}</span>
            <span>Canceladas</span>
          </div>
        </div>
      )}

      <Link to="/citas" className="btn btn-primario">
        Ir a Mis Citas
      </Link>
    </div>
  );
};

export default Dashboard;
