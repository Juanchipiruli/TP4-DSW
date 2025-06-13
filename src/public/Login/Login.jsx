import { Link, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../models/routes.models";
import { Form } from "../../components";
import { inputs } from "../../constants/inputs";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from "react";
import './Login.css';

export const Login = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      console.log(user);
      if (user.isAdmin) {
        return navigate(AppRoutes.dashboard);
      } else {
        return (<h1>Principal</h1>)
      }
    }
  }, []);

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
      setError(error.message);
    }
  }

  if (error) {
    return (
      <main>
        <h1>ERROR</h1>
        <p>{error}</p>
      </main>
    )
  }

  return (
    <main>
      <h1>Iniciar Sesión</h1>
      <Form 
        fields={inputs.filter(input => input.name === 'email' || input.name === 'password')}
        onSubmit={handleSubmit}
        submitText="Iniciar Sesión"
      />
      <footer>
        <Link to={AppRoutes.signUp}>No te has registrado aún?</Link>
      </footer>
    </main>
  )
}