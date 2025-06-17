import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../models/routes.models";
import placeholderImg from "../../assets/placeholder.png";
import "./DetallePrenda.css";

export const DetallePrenda = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prenda, setPrenda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [colorSeleccionado, setColorSeleccionado] = useState("");
  const [talleSeleccionado, setTalleSeleccionado] = useState("");
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    // Obtener la prenda específica por ID
    fetch(`http://localhost:3000/api/prendas/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setPrenda(data);
        setLoading(false);
        // Seleccionar el primer color y talle por defecto
        if (data.colores && data.colores.length > 0) {
          setColorSeleccionado(data.colores[0]);
        }
        if (data.talles && data.talles.length > 0) {
          setTalleSeleccionado(data.talles[0]);
        }
      })
      .catch((err) => {
        console.error("Error al obtener la prenda:", err);
        setLoading(false);
      });
  }, [id]);

  const handleAgregarAlCarrito = () => {
    if (!colorSeleccionado || !talleSeleccionado) {
      alert("Por favor selecciona un color y un talle");
      return;
    }

    // Aquí iría la lógica para agregar al carrito
    const itemCarrito = {
      prendaId: prenda._id,
      nombre: prenda.nombre,
      precio: prenda.precio,
      color: colorSeleccionado,
      talle: talleSeleccionado,
      cantidad: cantidad,
      imagen: prenda.imagenes
    };

    console.log("Agregando al carrito:", itemCarrito);
    // TODO: Implementar lógica del carrito
    alert("Producto agregado al carrito");
  };

  if (loading) {
    return <div className="detalle-loading">Cargando prenda...</div>;
  }

  if (!prenda) {
    return <div className="detalle-error">Prenda no encontrada</div>;
  }

  return (
    <div className="detalle-container">
      <header className="detalle-header">
        <button 
          className="detalle-back-button"
          onClick={() => navigate(AppRoutes.mainView)}
        >
          ← Volver
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
          <p className="detalle-descripcion">{prenda.detalle}</p>

          {/* Selector de colores */}
          {prenda.colores && prenda.colores.length > 0 && (
            <div className="detalle-selector">
              <h3>Color:</h3>
              <div className="detalle-colores">
                {prenda.colores.map((color, index) => (
                  <button
                    key={index}
                    className={`detalle-color-btn ${
                      colorSeleccionado === color ? "seleccionado" : ""
                    }`}
                    onClick={() => setColorSeleccionado(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de talles */}
          {prenda.talles && prenda.talles.length > 0 && (
            <div className="detalle-selector">
              <h3>Talle:</h3>
              <div className="detalle-talles">
                {prenda.talles.map((talle, index) => (
                  <button
                    key={index}
                    className={`detalle-talle-btn ${
                      talleSeleccionado === talle ? "seleccionado" : ""
                    }`}
                    onClick={() => setTalleSeleccionado(talle)}
                  >
                    {talle}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selector de cantidad */}
          <div className="detalle-selector">
            <h3>Cantidad:</h3>
            <div className="detalle-cantidad">
              <button
                className="detalle-cantidad-btn"
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              >
                -
              </button>
              <span className="detalle-cantidad-valor">{cantidad}</span>
              <button
                className="detalle-cantidad-btn"
                onClick={() => setCantidad(cantidad + 1)}
              >
                +
              </button>
            </div>
          </div>

          {/* Botón agregar al carrito */}
          <button
            className="detalle-agregar-btn"
            onClick={handleAgregarAlCarrito}
            disabled={!colorSeleccionado || !talleSeleccionado}
          >
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}; 