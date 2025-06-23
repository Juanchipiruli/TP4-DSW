import React, { useState } from "react";
import "./UserSidebar.css";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { IoIosArrowDown } from "react-icons/io";



export const UserSidebar = ({ open, onClose, handleFilterProducts }) => {
    const { logout, isAdmin, isAuthenticated } = useAuth();
    const [activeFilter, setActiveFilter] = useState(null);

    const handleLogout = () => {
        logout();
        onClose();
    };

    const handleCurrent = (tipo) => {
      const productosContent = document.getElementById("productos-content");
      productosContent.classList.toggle("current");
      if (activeFilter === tipo) {
        setActiveFilter(null);
      } else {
        setActiveFilter(tipo);
      }
      handleFilterProducts(tipo);
    }

    const handleViewProductos = () => {
      const productosContent = document.getElementById("productos-content");
      productosContent.classList.toggle("show");
      const arrow = document.getElementById("arrow");
      arrow.classList.toggle("rotate");
    }

    const responseTipos = useFetch({
      url: "http://localhost:3000/api/prendas/types/",
      options: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    });

  return (
    <div className={`user-sidebar ${open ? "open" : ""}`}>
      <header className="sidebar-header">
      <button className="close-btn" onClick={onClose}>×</button>
      </header>
      <div className="sidebar-content">
        <div className="productos-container">
          <div className="productos-header" onClick={() => handleViewProductos()}>
            <button className="sidebar-btn" id="productos-btn" >Productos </button>
            <IoIosArrowDown id="arrow"/>
          </div>
          <div id="productos-content">
            {responseTipos.data && responseTipos.data.map((tipo) => (
              <div key={tipo} className="productos-item">
                <button 
                  id="tipo-btn" 
                  key={tipo} 
                  className={`sidebar-btn ${activeFilter === tipo ? 'active-filter' : ''}`} 
                  onClick={() => handleCurrent(tipo)}
                >
                  {tipo}
                </button>
              </div>
            ))}
          </div>
        </div>
        {isAdmin() && (
          <Link to="/dashboard" className="sidebar-btn">
            Dashboard
          </Link>
        )}
        {!isAuthenticated() && (
          <Link to="/login" className="sidebar-btn">
            Iniciar sesión
          </Link>
        )}

        <div className="sidebar-btn-spacer" />
        
      </div>
      <div className="logout-btn-container">
          <button className="sidebar-btn" onClick={() => handleLogout()}>Cerrar sesión</button>
        </div>
    </div>
  );
};