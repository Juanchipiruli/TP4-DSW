import { Form, Error } from '../../components';
import { Link, useNavigate } from 'react-router-dom';
import { AppRoutes } from '../../models/routes.models';
import { inputs } from '../../constants/inputs';
import { useFetch } from '../../hooks/useFetch';
import { useEffect } from 'react';
import './SignUp.css'

export const SignUp = () => {
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useFetch({
    url: "http://localhost:3000/api/users/",
    autoFetch: false
  });

  const handleSubmit = (formData) => {
    // Aquí manejas el envío del formulario
    console.log(formData);
    refetch({options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    }});
  };

  useEffect(() => {
    if (data) {
      navigate(AppRoutes.login);
    }
  }, [data])

  return (
    <main className='Register-Main'>
      <h1>Registrarse</h1>
      <Form 
        fields={inputs}
        onSubmit={handleSubmit}
        submitText="Registrarse"
      />
      {error && (
        <Error text={error}/>
      )}
      <footer className='Register-Footer'>
        <Link to={AppRoutes.login}>Ya estas registrado?</Link>
      </footer>
    </main>
  );
};