import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const manejarLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-marca">
        <Link to="/">Citas Medicas</Link>
      </div>
      <div className="navbar-enlaces">
        {usuario ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/citas">Mis Citas</Link>
            {usuario.rol === 'admin' && <Link to="/usuarios">Usuarios</Link>}
            <span className="navbar-usuario">{usuario.nombre} ({usuario.rol})</span>
            <button onClick={manejarLogout} className="btn btn-secundario">
              Cerrar sesion
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Iniciar sesion</Link>
            <Link to="/registro">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
