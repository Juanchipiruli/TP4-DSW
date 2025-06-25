import { Link, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../models/routes.models";
import { Form, Error } from "../../components";
import { inputs } from "../../constants/inputs";
import { useAuth } from "../../context/AuthContext";
import { useEffect } from "react";
import './Login.css';

export const Login = () => {
  const { login, user, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.isAdmin) {
        return navigate(AppRoutes.dashboard);
      } else {
        return navigate(AppRoutes.mainView);
      }
    }
  }, [user]);

  const handleSubmit = async (formData) => {
    try {
      await login({
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      navigate(AppRoutes.dashboard);
    } catch (error) {
      console.error(error.message);
    }
  }

  return (
    <main>
      <h1>Iniciar Sesión</h1>
      <Form 
        fields={inputs.filter(input => input.name === 'email' || input.name === 'password')}
        onSubmit={handleSubmit}
        submitText="Iniciar Sesión"
      />
      {error && (
        <Error text={error}/>
      )}
      <footer>
        <Link to={AppRoutes.signUp}>No te has registrado aún?</Link>
      </footer>
    </main>
  )
}