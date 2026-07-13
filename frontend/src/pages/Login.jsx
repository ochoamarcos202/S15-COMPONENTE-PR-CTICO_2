import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const manejarCambio = (e) => {
    setFormulario((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await login(formulario.email, formulario.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'No fue posible iniciar sesion');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="contenedor-auth">
      <form className="formulario formulario-auth" onSubmit={manejarEnvio}>
        <h2>Iniciar sesion</h2>
        {error && <p className="mensaje-error">{error}</p>}

        <div className="campo">
          <label>Correo electronico</label>
          <input type="email" name="email" value={formulario.email} onChange={manejarCambio} required />
        </div>

        <div className="campo">
          <label>Contrasena</label>
          <input
            type="password"
            name="password"
            value={formulario.password}
            onChange={manejarCambio}
            required
          />
        </div>

        <button type="submit" className="btn btn-primario btn-ancho" disabled={enviando}>
          {enviando ? 'Ingresando...' : 'Ingresar'}
        </button>

        <p className="texto-auxiliar">
          No tienes cuenta? <Link to="/registro">Registrate aqui</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
