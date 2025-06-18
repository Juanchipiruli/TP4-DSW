import React, { useEffect, useState } from "react";
import TarjetasPrenda from "../../components/TarjetasPrenda/TarjetasPrenda";
import "./MainView.css";
import { Link, useNavigate } from "react-router-dom";
import { AppRoutes } from "../../models/routes.models";
import logo from "../../assets/logo.png";
import { FaRegUser } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { useFetch } from "../../hooks/useFetch";

export const MainView = () => {
  const [prendas, setPrendas] = useState([]);
  const navigate = useNavigate();

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
      console.log(error);
    }
  }, [data]); 

  if (loading) return <div className="mainview-loading">Cargando prendas...</div>;

  return (
    <div className="mainview-container">
      <header className="mainview-header">
        <img src={logo} alt="logo" className="mainview-header-logo"/>
        <div className="mainview-header-buttons">
          <button className="mainview-header-button" onClick={() => navigate(AppRoutes.login)}>
            <FaRegUser />
          </button>
          <button className="mainview-header-button" onClick={() => navigate(AppRoutes.login)}>
          <FaCartShopping />
          </button>
        </div>
      </header>
      <div className="mainview-grid">
        {prendas.map((prenda) => (
          <TarjetasPrenda key={prenda.id} prenda={prenda} />
        ))}
      </div>
    </div>
  );
};

