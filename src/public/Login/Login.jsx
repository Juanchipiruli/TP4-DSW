import { Link } from "react-router-dom";
import { AppRoutes } from "../../models/routes.models";
import { Form } from "../../components";
import { inputs } from "../../constants/inputs";

export const Login = () => {
  const handleSubmit = (formData) => {
    // Aquí manejas el envío del formulario
    console.log(formData);
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