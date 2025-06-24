import React, { useEffect, useState } from "react";
import TarjetasPrenda from "../../components/TarjetasPrenda/TarjetasPrenda";
import "./MainView.css";
import { Link, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../models/routes.models";
import logo from "../../assets/logo.png";
import { FaRegUser } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { useFetch } from "../../hooks/useFetch";
import { UserSidebar, CartSidebar } from "../../components";
import { useAuth } from "../../context/AuthContext";

export const MainView = () => {
  const [prendas, setPrendas] = useState([]);
  const [filter, setFilter] = useState([]);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const {data, loading, error} = useFetch({
    url: "http://localhost:3000/api/prendas/",
    options: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  })
  
  useEffect(() => {
    if (data) {
      setPrendas(data);
    }else{
      setPrendas([]);
    }
  }, [data]); 

  const handleFilterProducts = (tipo) => {
    if (filter[0]?.tipo === tipo) {
      setFilter([]);
    } else {
      setFilter(prendas.filter((prenda) => prenda.tipo === tipo));
    }
  }

  if (loading) return <div className="mainview-loading">Cargando prendas...</div>;

  return (
    <div className="mainview-container">
      <header className="mainview-header">
        <img src={logo} alt="logo" className="mainview-header-logo"/>
        <div className="mainview-header-buttons">
          <button
            className="mainview-header-button"
            onClick={() => {
              setSidebarOpen(true);
            }}
          >
            <FaRegUser />
          </button>
          {isAuthenticated() && (
            <button className="mainview-header-button" onClick={() => setCartOpen(true)}>
              <FaCartShopping />
            </button>
          )}
        </div>
      </header>
      <div className="mainview-grid">
        {filter.length === 0 ? prendas.map((prenda) => (
          <TarjetasPrenda key={prenda.id} prenda={prenda} />
        )) : filter.map((prenda) => (
          <TarjetasPrenda key={prenda.id} prenda={prenda} />
        ))}
      </div>
      <UserSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        handleFilterProducts={handleFilterProducts}
      />
      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </div>
  );
};

