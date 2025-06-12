import { AuthProvider } from "./context/AuthContext";

export const App = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}