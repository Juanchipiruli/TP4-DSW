import React from "react";
import "./UserSidebar.css";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export const UserSidebar = ({ open, onClose, onProductos, onLogout }) => {
    const { logout, isAdmin } = useAuth();
    const handleLogout = () => {
        logout();
        onClose();
    };
  return (
    <div className={`user-sidebar ${open ? "open" : ""}`}>
      <header className="sidebar-header">
      <button className="close-btn" onClick={onClose}>×</button>
      </header>
      <div className="sidebar-content">
        <button className="sidebar-btn" onClick={onProductos}>Productos</button>
        {isAdmin && (
          <Link to="/dashboard" className="sidebar-btn">
            Dashboard
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