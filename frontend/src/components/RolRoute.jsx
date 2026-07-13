import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const RolRoute = ({ roles, children }) => {
  const { usuario, cargando } = useAuth();

  if (cargando) return <p className="mensaje-carga">Cargando sesion...</p>;
  if (!usuario) return <Navigate to="/login" replace />;
  if (!roles.includes(usuario.rol)) return <Navigate to="/dashboard" replace />;

  return children;
};

export default RolRoute;
