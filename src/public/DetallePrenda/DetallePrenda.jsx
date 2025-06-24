import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../models/routes.models";
import placeholderImg from "../../assets/placeholder.png";
import "./DetallePrenda.css";
import { FaCartShopping } from "react-icons/fa6";
import { IoReturnUpBack } from "react-icons/io5";
import { useFetch } from "../../hooks/useFetch";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export const DetallePrenda = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prenda, setPrenda] = useState(null);
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [colorSeleccionado, setColorSeleccionado] = useState("");
  const [talleSeleccionado, setTalleSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);

  const { cart, setCart } = useCart();
  const { token } = useAuth();

  useEffect(() => {
    // Obtener la prenda específica por ID
    fetch(`http://localhost:3000/api/prendas/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPrenda(data);
        // Obtener el stock de esta prenda
        return fetch(`http://localhost:3000/api/stocks/product/${id}`);
      })
      .then((res) => res.json())
      .then((stockData) => {
        setStock(stockData);
        setLoading(false);
        
        // Seleccionar el primer color y talle disponible por defecto
        if (stockData.length > 0) {
          const primerStock = stockData.find(s => s.disponible && s.cantidad > 0);
          if (primerStock) {
            setColorSeleccionado(primerStock.Color.nombre);
            setTalleSeleccionado(primerStock.Talle.nombre);
          }
        }
      })
      .catch((err) => {
        console.error("Error al obtener la prenda o stock:", err);
        setLoading(false);
      });
  }, [id]);

  // Obtener colores únicos disponibles
  const getColoresDisponibles = () => {
    const coloresUnicos = [];
    stock.forEach((item) => {
      const colorExiste = coloresUnicos.find(c => c.nombre === item.Color.nombre);
      if (!colorExiste) {
        coloresUnicos.push({
          nombre: item.Color.nombre,
          codigo_hex: item.Color.codigo_hex,
          disponible: item.disponible && item.cantidad > 0
        });
      }
    });
    return coloresUnicos;
  };

  // Obtener talles únicos disponibles
  const getTallesDisponibles = () => {
    const tallesUnicos = [];
    stock.forEach((item) => {
      const talleExiste = tallesUnicos.find(t => t.nombre === item.Talle.nombre);
      if (!talleExiste) {
        tallesUnicos.push({
          nombre: item.Talle.nombre,
          disponible: item.disponible && item.cantidad > 0
        });
      }
    });
    return tallesUnicos;
  };

  // Verificar si una combinación color-talle está disponible
  const isCombinacionDisponible = (color, talle) => {
    return stock.some(item => 
      item.Color.nombre === color && 
      item.Talle.nombre === talle && 
      item.disponible && 
      item.cantidad > 0
    );
  };

  // Obtener cantidad disponible para la combinación seleccionada
  const getCantidadDisponible = () => {
    const stockItem = stock.find(item => 
      item.Color.nombre === colorSeleccionado && 
      item.Talle.nombre === talleSeleccionado
    );
    return stockItem ? stockItem.cantidad : 0;
  };

  const responseAddToCarrito = useFetch({ autoFetch: false });
  const refetchAddToCarrito = responseAddToCarrito.refetch;

  const handleAgregarAlCarrito = async () => {
    if (!colorSeleccionado || !talleSeleccionado) {
      alert("Por favor selecciona un color y un talle");
      return;
    }

    if (!isCombinacionDisponible(colorSeleccionado, talleSeleccionado)) {
      alert("Esta combinación de color y talle no está disponible");
      return;
    }

    if (cantidad > getCantidadDisponible()) {
      alert(`Solo hay ${getCantidadDisponible()} unidades disponibles`);
      return;
    }

    const stock_id = stock.filter(s => {
      if (s.Color.nombre === colorSeleccionado && s.Talle.nombre === talleSeleccionado) {
        return s;
      }
    })

    await refetchAddToCarrito({
      url: "http://localhost:3000/api/carritos/item/",
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ carrito_id: cart.id, stock_id: stock_id[0].id, cantidad: cantidad, prenda_id: stock_id[0].prenda_id, talle_id: stock_id[0].talle_id, color_id: stock_id[0].color_id })
      }
    });
  };

  useEffect(() => {
    if (responseAddToCarrito.data) {
      setCart(prevCart => {
        const exist = prevCart.Stocks.some(item => item.id === responseAddToCarrito.data.carritoStock.id);
        if (exist) {
          return {...prevCart, Stocks: prevCart.Stocks.map(item => item.id === responseAddToCarrito.data.carritoStock.id ? responseAddToCarrito.data.carritoStock : item)};
        } else {
          return {...prevCart, Stocks: [...prevCart.Stocks, responseAddToCarrito.data.carritoStock]};
        }
      });
    }
  }, [responseAddToCarrito.data])

  if (loading) {
    return <div className="detalle-loading">Cargando prenda...</div>;
  }

  if (!prenda) {
    return <div className="detalle-error">Prenda no encontrada</div>;
  }

  const coloresDisponibles = getColoresDisponibles();
  const tallesDisponibles = getTallesDisponibles();
  const cantidadDisponible = getCantidadDisponible();

  return (
    <div className="detalle-container">
      <header className="detalle-header">
        <button 
          className="detalle-back-button"
          onClick={() => navigate(AppRoutes.mainView)}
        >
          <IoReturnUpBack />
        </button>
        <h1 className="detalle-title">Detalle del Producto</h1>
      </header>

      <div className="detalle-content">
        <div className="detalle-image-section">
          <div className="detalle-image-container">
            {prenda.imagenes ? (
              <img
                src={prenda.imagenes}
                alt={prenda.nombre}
                className="detalle-image"
                onError={(e) => {
                  e.target.src = placeholderImg;
                }}
              />
            ) : (
              <img
                src={placeholderImg}
                alt="Imagen no disponible"
                className="detalle-image"
              />
            )}
          </div>
        </div>

        <div className="detalle-info-section">
          <h2 className="detalle-nombre">{prenda.nombre}</h2>
          <p className="detalle-precio">${prenda.precio}</p>

          {/* Selector de colores */}
          {coloresDisponibles.length > 0 && (
            <div className="detalle-selector">
              <h3>Color:</h3>
              <div className="detalle-colores">
                {coloresDisponibles.map((color, index) => (
                  <button
                    key={index}
                    className={`detalle-color-btn ${
                      colorSeleccionado === color.nombre ? "seleccionado" : ""
                    } ${!color.disponible ? "no-disponible" : ""}`}
                    onClick={() => setColorSeleccionado(color.nombre)}
                    disabled={!color.disponible}
                  >
                    {color.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de talles */}
          {tallesDisponibles.length > 0 && (
            <div className="detalle-selector">
              <h3>Talle:</h3>
              <div className="detalle-talles">
                {tallesDisponibles.map((talle, index) => (
                  <button
                    key={index}
                    className={`detalle-talle-btn ${
                      talleSeleccionado === talle.nombre ? "seleccionado" : ""
                    } ${!talle.disponible ? "no-disponible" : ""}`}
                    onClick={() => setTalleSeleccionado(talle.nombre)}
                    disabled={!talle.disponible}
                  >
                    {talle.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Información de disponibilidad */}
          {colorSeleccionado && talleSeleccionado && (
            <div className="detalle-disponibilidad">
              <p>Disponible {colorSeleccionado} {talleSeleccionado}: {cantidadDisponible} unidades</p>
            </div>
          )}

          {/* Selector de cantidad */}
          <div className="detalle-selector">
            <h3>Cantidad:</h3>
            <div className="detalle-cantidad">
              <button
                className="detalle-cantidad-btn"
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                disabled={cantidad <= 1}
              >
                -
              </button>
              <span className="detalle-cantidad-valor">{cantidad}</span>
              <button
                className="detalle-cantidad-btn"
                onClick={() => setCantidad(Math.min(cantidadDisponible, cantidad + 1))}
                disabled={cantidad >= cantidadDisponible}
              >
                +
              </button>
            </div>
          </div>

          {/* Botón agregar al carrito */}
          <button
            className="detalle-agregar-btn"
            onClick={handleAgregarAlCarrito}
            disabled={!colorSeleccionado || !talleSeleccionado || cantidadDisponible === 0}
          >
            {cantidadDisponible === 0 ? "No disponible" : <FaCartShopping />}
          </button>
        </div>
      </div>
    </div>
  );
}; 