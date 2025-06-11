import { useState } from "react";
import { Link } from "react-router-dom";
import { AppRoutes } from "../../models/routes.models";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <main>
      <h1>Iniciar Sesión</h1>
      <form>
        <fieldset>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="text" name="email" value={email} onChange={setEmail} id="email"/>
          </div>
          <div>
            <label htmlFor="password">Contraseña:</label>
            <input type="password" name="email" value={password} onChange={setPassword} id="password"/>
          </div>
        </fieldset>
      </form>
      <footer>
        <Link to={AppRoutes.signUp}>No te has registrado aún?</Link>
      </footer>
    </main>
  )
}