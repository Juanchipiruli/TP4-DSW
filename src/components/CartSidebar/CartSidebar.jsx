import "../UserSidebar/UserSidebar.css";
import { useCart } from "../../context/CartContext";

export const CartSidebar = ({ open, onClose }) => {
  const { cart } = useCart();

  const handleSendWathsapp = () => {
    const message = `Hola, quiero comprar las siguientes prendas:\n\n${cart.Stocks.map((item) => `${item.Prenda.nombre} (${item.CarritoStock.cantidad} unidades)`).join("\n")}\n\nTotal: ${cart.Stocks.reduce((acc, item) => acc + item.Prenda.precio * item.CarritoStock.cantidad, 0)}`;
    const numero = "5493564362360";
    window.open(`https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(message)}`, "_blank");
  }

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
              <div key={`${item.id}${item.Prenda.nombre}`}>  
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
        <button onClick={() => handleSendWathsapp()}>Consultar</button>
      </div>
    </div>
  );
};
