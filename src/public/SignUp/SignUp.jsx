import { useState } from "react"
import { Link } from "react-router-dom"
import { AppRoutes } from "../../models/routes.models";

export const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleOnChange = (e, setValue) => {
    const newValue = e.target.value;
    setValue(newValue);
  }

  return ( 
    <main>
      <h1>Registrarse</h1>
      <form>
        <fieldset>
          <div>
            <label htmlFor="nombre">Nombre:</label>
            <input type="text" name="nombre" onChange={(e) => handleOnChange(e, setName)} value={name} id="nombre"/>
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" name="email" onChange={(e) => handleOnChange(e, setEmail)} value={email} id="email"/>
          </div>
          <div>
            <label htmlFor="telefono">Teléfono:</label>
            <input type="tel" name="telefono" onChange={(e) => handleOnChange(e, setTelefono)} value={telefono} id="telefono"/>
          </div>
          <div>
            <label htmlFor="password">Contraseña:</label>
            <input type="password" name="password" onChange={(e) => handleOnChange(e, setPassword)} value={password} id="password"/>
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
            <input type="password" name="confirmPassword" onChange={(e) => handleOnChange(e, setConfirmPassword)} value={confirmPassword} id="confirmPassword"/>
          </div>
        </fieldset>
      </form>
      <footer>
        <Link to={AppRoutes.login}>Ya estas registrado?</Link>
      </footer>
    </main>
  )
}