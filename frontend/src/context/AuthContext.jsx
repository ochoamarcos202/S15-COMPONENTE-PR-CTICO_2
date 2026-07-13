import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  
  useEffect(() => {
    const restaurarSesion = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setCargando(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/perfil');
        setUsuario(data.usuario);
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
      } finally {
        setCargando(false);
      }
    };
    restaurarSesion();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    setUsuario(data.usuario);
    return data.usuario;
  };

  const registrar = async (datosRegistro) => {
    const { data } = await api.post('/auth/registro', datosRegistro);
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      setUsuario(data.usuario);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, cargando, login, registrar, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
