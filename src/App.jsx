import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

export const App = ({ children }) => {
  return (
    <CartProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </CartProvider>
  )
}