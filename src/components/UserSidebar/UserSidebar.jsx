import React from "react";
import "./UserSidebar.css";
import { useAuth } from "../../context/AuthContext";

export const UserSidebar = ({ open, onClose, onProductos, onLogout }) => {
    const { logout } = useAuth();
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
        <div className="sidebar-btn-spacer" />
        <div className="logout-btn-container">
          <button className="sidebar-btn" onClick={() => handleLogout()}>Cerrar sesión</button>
        </div>
      </div>
    </div>
  );
};