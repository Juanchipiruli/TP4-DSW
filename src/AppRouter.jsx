import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { RoutesWithNotFound } from "./components/RoutesWithNotFound";
import { AppRoutes } from "./models/routes.models";
import { Login, SignUp, MainView, DetallePrenda } from "./public";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PrivateRoutes } from "./components/PrivateRoutes";

export const AppRouter = () => {
  return (
    <HashRouter>
      <RoutesWithNotFound>
        <Route path="/" element={<Navigate to={AppRoutes.mainView} />} />
        <Route path={AppRoutes.login} element={<Login/>} />
        <Route path={AppRoutes.signUp} element={<SignUp/>} />
        <Route path={AppRoutes.mainView} element={<MainView/>} />
        <Route path={AppRoutes.detallePrenda} element={<DetallePrenda/>} />
        <Route element={<ProtectedRoute requireAdmin />}>
        <Route path={AppRoutes.dashboard + "/*"} element={<PrivateRoutes />} />
        </Route>
      </RoutesWithNotFound>
    </HashRouter>
  )
}
