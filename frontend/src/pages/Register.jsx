import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { registrar } = useAuth();
  const navigate = useNavigate();
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'paciente',
    especialidad: '',
    telefono: '',
  });
  const [errores, setErrores] = useState([]);
  const [mensajeExito, setMensajeExito] = useState('');
  const [enviando, setEnviando] = useState(false);

  const manejarCambio = (e) => {
    setFormulario((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setErrores([]);
    setMensajeExito('');
    setEnviando(true);
    try {
      const data = await registrar(formulario);
      if (data.token) {
        
        navigate('/dashboard');
      } else {
        
        setMensajeExito(
          data.mensaje || 'Cuenta creada. Debe esperar la aprobacion de un administrador.'
        );
      }
    } catch (err) {
      const mensajes = err.response?.data?.errores || [
        err.response?.data?.mensaje || 'No fue posible completar el registro',
      ];
      setErrores(mensajes);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="contenedor-auth">
      <form className="formulario formulario-auth" onSubmit={manejarEnvio}>
        <h2>Crear cuenta</h2>

        {errores.length > 0 && (
          <ul className="lista-errores">
            {errores.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        )}

        {mensajeExito && <p className="mensaje-exito">{mensajeExito}</p>}

        <div className="campo">
          <label>Nombre completo</label>
          <input type="text" name="nombre" value={formulario.nombre} onChange={manejarCambio} required />
        </div>

        <div className="campo">
          <label>Correo electronico</label>
          <input type="email" name="email" value={formulario.email} onChange={manejarCambio} required />
          {formulario.rol === 'medico' && (
            <small className="texto-ayuda">Los medicos deben usar un correo institucional (@clinica.com)</small>
          )}
        </div>

        <div className="campo">
          <label>Contrasena</label>
          <input
            type="password"
            name="password"
            value={formulario.password}
            onChange={manejarCambio}
            required
            minLength={6}
          />
        </div>

        <div className="campo">
          <label>Tipo de cuenta</label>
          <select name="rol" value={formulario.rol} onChange={manejarCambio}>
            <option value="paciente">Paciente</option>
            <option value="medico">Medico</option>
          </select>
        </div>

        {formulario.rol === 'medico' && (
          <div className="campo">
            <label>Especialidad</label>
            <input
              type="text"
              name="especialidad"
              value={formulario.especialidad}
              onChange={manejarCambio}
              required
            />
          </div>
        )}

        <div className="campo">
          <label>Telefono</label>
          <input type="text" name="telefono" value={formulario.telefono} onChange={manejarCambio} />
        </div>

        <button type="submit" className="btn btn-primario btn-ancho" disabled={enviando}>
          {enviando ? 'Creando cuenta...' : 'Registrarme'}
        </button>

        <p className="texto-auxiliar">
          Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
