import { Link, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../models/routes.models";
import { Form } from "../../components";
import { inputs } from "../../constants/inputs";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    try {
      await login({
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      navigate(AppRoutes.admin);
    } catch (error) {
      setError(error.message);
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
      <footer>
        <Link to={AppRoutes.signUp}>No te has registrado aún?</Link>
      </footer>
    </main>
  )
}