import "../UserSidebar/UserSidebar.css";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { CiTrash, CiEdit } from "react-icons/ci";
import { CiCircleCheck } from "react-icons/ci";
import { useFetch } from "../../hooks/useFetch";
import { useEffect, useState } from "react";

export const CartSidebar = ({ open, onClose }) => {
  const [update, setUpdate] = useState(null);

  const { cart, setCart } = useCart();
  const { token } = useAuth();

  const responseDeleteItem = useFetch({ autoFetch: false });
  const refetchDeleteItem = responseDeleteItem.refetch;

  const handleSendWathsapp = () => {
    const message = `Hola, quiero comprar las siguientes prendas:\n\n${cart.Stocks.map((item) => `${item.Prenda.nombre} (${item.CarritoStock.cantidad} unidades)`).join("\n")}\n\nTotal: ${cart.Stocks.reduce((acc, item) => acc + item.Prenda.precio * item.CarritoStock.cantidad, 0)}`;
    const numero = "5493564226980";
    window.open(`https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(message)}`, "_blank");
  }

  const handleDeleteItem = async ({idCarrito, idStock}) => {
    await refetchDeleteItem({
      url: `http://localhost:3000/api/carritos/${idCarrito}/item/${idStock}`,
      options: {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      }
    });
  }

  useEffect(() => {
    if (responseDeleteItem.data) {
      console.log(responseDeleteItem.data);
      setCart(prevCart => ({
        ...prevCart,
        Stocks: prevCart.Stocks.filter(item => item.id !== responseDeleteItem.data.carritoStock.StockId)
      }));
    }
  }, [responseDeleteItem.data]);

  const handleViewEdit = (idStock) => {
    if (!update) {
      setUpdate(idStock);
    } else {
      setUpdate(null);
    }
  }

  const responseUpdateItem = useFetch({ autoFetch: false });
  const refetchUpdateItem = responseUpdateItem.refetch;

  const handleUpdateItem = async ({idCarrito, idStock}) => {
    const cantidad = cart.Stocks.find(item => item.id === idStock).CarritoStock.cantidad;
    if (cantidad === 0) {
      handleDeleteItem({idCarrito, idStock});
      return;
    }else if (cantidad > 0) {
      await refetchUpdateItem({
        url: `http://localhost:3000/api/carritos/item/`,
        options: {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ carrito_id: idCarrito, stock_id: idStock, cantidad: cart.Stocks.find(item => item.id === idStock).CarritoStock.cantidad })
        }
      });
    }    
  }

  useEffect(() => {
    if (responseUpdateItem.data) {
      setUpdate(null);
    }
  }, [responseUpdateItem.data])

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
                  <p>Talle: {item.Talle.nombre}</p>
                  <p>Color: {item.Color.nombre}</p>
                  {update === item.id ? (
                    <input
                      type="number"
                      min={0}
                      value={item.CarritoStock.cantidad}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setCart(prevCart => ({
                          ...prevCart,
                          Stocks: prevCart.Stocks.map(i =>
                            i.id === update
                              ? { ...i, CarritoStock: { ...i.CarritoStock, cantidad: value } }
                              : i
                          )
                        }));
                      }}
                    />
                  ) : (
                    <p>Cantidad: {item.CarritoStock.cantidad}</p>
                  )}
                  <p>Prenda: {item.Prenda.nombre}</p>
                  <p>Precio: ${item.Prenda.precio * item.CarritoStock.cantidad}</p>
                </div>
                </div>
                <div className="cart-item-buttons">
                  <button className="cart-item-button" onClick={() => handleDeleteItem({idCarrito: cart.id, idStock: item.id})}><CiTrash/></button>
                  <button className="cart-item-button" onClick={() => handleViewEdit(item.id)}><CiEdit/></button>
                  {update === item.id && (
                    <button className="cart-item-button" onClick={() => handleUpdateItem({idCarrito: cart.id, idStock: item.id})}><CiCircleCheck/></button>
                  )}
                </div>
                </div>
            ))}
          </>
        ) : (
          <p id="cart-empty">Carrito vacio</p>
        )}
        {cart && cart.Stocks.length > 0 && <button id="consulta-btn" onClick={() => handleSendWathsapp()}>Consultar</button>}
      </div>
    </div>
  );
};
