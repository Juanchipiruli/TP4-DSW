import React, { useEffect, useState } from "react";
import TarjetasPrenda from "../../components/TarjetasPrenda/TarjetasPrenda";
import "./MainView.css";

export const MainView = () => {
  const [prendas, setPrendas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cambia la URL por la de tu backend
    fetch("http://localhost:3000/api/prendas")
      .then((res) => res.json())
      .then((data) => {
        setPrendas(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener prendas:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="mainview-loading">Cargando prendas...</div>;

  return (
    <div className="mainview-container">
      <header className="mainview-header">
        <h1>hola</h1>
      </header>
      <div className="mainview-grid">
        {prendas.map((prenda) => (
          <TarjetasPrenda key={prenda._id} prenda={prenda} />
        ))}
      </div>
    </div>
  );
};

