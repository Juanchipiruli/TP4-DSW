import "../UserSidebar/UserSidebar.css";
import { useCart } from "../../context/CartContext";
import { CiTrash, CiEdit } from "react-icons/ci";

export const CartSidebar = ({ open, onClose }) => {
  const { cart } = useCart();

  const handleSendWathsapp = () => {
    const message = `Hola, quiero comprar las siguientes prendas:\n\n${cart.Stocks.map((item) => `${item.Prenda.nombre} (${item.CarritoStock.cantidad} unidades)`).join("\n")}\n\nTotal: ${cart.Stocks.reduce((acc, item) => acc + item.Prenda.precio * item.CarritoStock.cantidad, 0)}`;
    const numero = "5493564362360";
    window.open(`https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(message)}`, "_blank");
  }

  return (
    <div className={`cart-sidebar ${open ? "open" : ""}`}>
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
              <div key={`${item.id}${item.Prenda.nombre}`} className="sidebar-cart-item">  
                <div className="cart-item-info">
                <div className="cart-img-container">
                <img src={item.Prenda.imagenes} alt="Imagen de la prenda" className="cart-img" />
                </div>
                <div className="cart-item-details">
                  <p>Talle: {item.CarritoStock.Talle}</p>
                  <p>Color: {item.CarritoStock.Color}</p>
                  <p>Cantidad: {item.CarritoStock.cantidad}</p>
                  <p>Prenda: {item.Prenda.nombre}</p>
                  <p>Precio: ${item.Prenda.precio * item.CarritoStock.cantidad}</p>
                </div>
                </div>
                <div className="cart-item-buttons">
                  <button className="cart-item-button"><CiTrash/></button>
                  <button className="cart-item-button"><CiEdit/></button>
                </div>
                </div>
            ))}
          </>
        ) : (
          <p>Carrito vacio</p>
        )}
        {cart && cart.Stocks.length > 0 && <button id="consulta-btn" onClick={() => handleSendWathsapp()}>Consultar</button>}
      </div>
    </div>
  );
};
