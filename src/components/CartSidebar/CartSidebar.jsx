import "../UserSidebar/UserSidebar.css";
import { useCart } from "../../context/CartContext";

export const CartSidebar = ({ open, onClose }) => {
  const { cart } = useCart();

  console.log(cart);

  return (
    <div className={`user-sidebar ${open ? "open" : ""}`}>
      <header className="sidebar-header">
        <h2 className="sidebar-title">Carrito</h2>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </header>
      <div className="sidebar-content">
        <div className="sidebar-btn-spacer" />
        {cart && cart.Stocks.length > 0 ? (
          <>
            {cart.Stocks.map((item) => (
              <div key={item.id}>
                <img src={item.Prenda.imagenes} alt="Imagen de la prenda" />
                <p>Cantidad: {item.CarritoStock.cantidad}</p>
                <p>Prenda: {item.Prenda.nombre}</p>
                <p>Precio: ${item.Prenda.precio * item.CarritoStock.cantidad}</p>
              </div>
            ))}
          </>
        ) : (
          <p>Carrito vacio</p>
        )}
      </div>
    </div>
  );
};
