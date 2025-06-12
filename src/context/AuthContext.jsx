import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para iniciar sesión
  const login = async (credentials) => {
    try {
      setLoading(true);
      // Aquí va tu lógica de login con el backend
      const response = await fetch('http://localhost:3000/api/users/login/', credentials);
      
      const data = await response.json();

      console.log(data);
      
      if (!response.ok) throw new Error(data.message);
      
      setUser(data.user);
      // Guardar token en localStorage
      localStorage.setItem('token', data.token);
      return data;
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  // Función para verificar si el usuario está autenticado
  const isAuthenticated = () => !!user;

  // Función para verificar si el usuario es admin
  const isAdmin = () => user?.isAdmin === true;

  // Verificar token al cargar la aplicación
  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verificar token con el backend
          const response = await fetch('tu-api/verify-token', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await response.json();
          if (response.ok) setUser(data.user);
        }
      } catch (error) {
        console.error('Error verificando token:', error);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};