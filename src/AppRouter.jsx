import { HashRouter, Navigate, Route } from "react-router-dom";
import { RoutesWithNotFound } from "./components/RoutesWithNotFound";
import { AppRoutes } from "./models/routes.models";
import { Login, SignUp } from "./public";

export const AppRouter = () => {
  return (
    <HashRouter>
      <RoutesWithNotFound>
        <Route path="/" element={<Navigate to={AppRoutes.login} />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
      </RoutesWithNotFound>
    </HashRouter>
  )
}