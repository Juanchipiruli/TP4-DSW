import { Form } from '../../components';
import { Link } from 'react-router-dom';
import { AppRoutes } from '../../models/routes.models';
import { inputs } from '../../constants/inputs';

export const SignUp = () => {
  const handleSubmit = (formData) => {
    // Aquí manejas el envío del formulario
    console.log(formData);
  };

  return (
    <main>
      <h1>Registrarse</h1>
      <Form 
        fields={inputs}
        onSubmit={handleSubmit}
        submitText="Registrarse"
      />
      <footer>
        <Link to={AppRoutes.login}>Ya estas registrado?</Link>
      </footer>
    </main>
  );
};