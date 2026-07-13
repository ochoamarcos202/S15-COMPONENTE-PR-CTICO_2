import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


const PrivateRoute = ({ children }) => {
  const { usuario, cargando } = useAuth();

  if (cargando) return <p className="mensaje-carga">Cargando sesion...</p>;
  if (!usuario) return <Navigate to="/login" replace />;

  return children;
};

export default PrivateRoute;
