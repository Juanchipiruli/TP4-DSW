import "../UserSidebar/UserSidebar.css";
import { useFetch } from "../../hooks/useFetch";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";

export const CartSidebar = ({ open, onClose }) => {
  const { user, token } = useAuth();

  const { data, error, loading, refetch } = useFetch({
    autoFetch: false
  });

  useEffect(() => {
    refetch({
      url: `http://localhost:3000/api/carritos/user/${user.id}`,
      options: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    });
  }, [])

  return (
    <div className={`user-sidebar ${open ? "open" : ""}`}>
      <header className="sidebar-header">
        <h2 className="sidebar-title">Carrito</h2>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
      </header>
      <div className="sidebar-content">
        <div className="sidebar-btn-spacer" />
        {data && data.length > 0 ? (
          <>
            {data.map((item) => (
              <div key={item.id}>
                <p>{item.nombre}</p>
                <p>{item.precio}</p>
              </div>
            ))}
          </>
        ) : (
          <p>{error}</p>
        )}
      </div>
    </div>
  );
};
