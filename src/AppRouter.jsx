import { HashRouter, Navigate, Route } from "react-router-dom";
import { RoutesWithNotFound } from "./components/RoutesWithNotFound";
import { AppRoutes } from "./models/routes.models";
import { Login, SignUp } from "./public";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const AppRouter = () => {
  return (
    <HashRouter>
      <RoutesWithNotFound>
        <Route path="/" element={<Navigate to={AppRoutes.login} />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <h1>Dashboard</h1>
          </ProtectedRoute>
        }
        />
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <h1>Admin</h1>
          </ProtectedRoute>
        }
        />
      </RoutesWithNotFound>
    </HashRouter>
  )
}
