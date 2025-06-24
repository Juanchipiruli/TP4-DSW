import { createContext, useState, useContext, useEffect } from 'react';
import { useCart } from './CartContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const { setCart } = useCart();

  useEffect(() => {
    const fetchCart = async () => {
      const responseCart = await fetch(`http://localhost:3000/api/carritos/user/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      const dataCart = await responseCart.json();

      setCart(dataCart);
    }

    if (user) {
      fetchCart();
    }
  }, [user]);

  // Función para iniciar sesión
  const login = async (credentials) => {
    try {
      setLoading(true);
      // Aquí va tu lógica de login con el backend
      const response = await fetch('http://localhost:3000/api/users/login/', credentials);
      
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.message);

      setUser(data.user);
      // Guardar token en localStorage
      localStorage.setItem('token', data.token);
      return data;
    } catch (err) {
      setError(err.message);
      setTimeout(() => {
        setError(null);
      }, 3000);
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
        setToken(localStorage.getItem('token'));
        if (token) {
          // Verificar token con el backend
          const response = await fetch('http://localhost:3000/api/users/validate-token/', {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await response.json();
          if (response.ok) {
            setUser(data.user);
          } else {
            throw new Error(data.message);
          }
        }
      } catch (error) {
        setError(error.message);
        setTimeout(() => {
          setError(null);
        }, 3000);
        console.error('Error verificando token:', error);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token]);

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    token
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