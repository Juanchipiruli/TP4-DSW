import { Link } from "react-router-dom";
import { AppRoutes } from "../../models/routes.models";

export const Dashboard = () => {
  return (
    <main>
      <h1>Dashboard</h1>
      <Link to={AppRoutes.dashboardNew}>Crear</Link>
      <Link to={AppRoutes.dashboardEdit}>Editar</Link>
      <Link to={AppRoutes.dashboardView}>Ver</Link>
    </main>
  );
}