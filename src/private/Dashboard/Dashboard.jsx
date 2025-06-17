import { Link } from "react-router-dom";
import { AppRoutes } from "../../models/routes.models";
import { useFetch } from "../../hooks/useFetch";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

export const Dashboard = () => {
  const [clothes, setClothes] = useState([]);

  const { token } = useAuth();

  const responseDataClothes = useFetch({
    url: "http://localhost:3000/api/prendas/",
    options: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  });

  const dataClothes = responseDataClothes.data;
  const loadingClothes = responseDataClothes.loading;
  const errorClothes = responseDataClothes.error;

  const responseDeleteClothe = useFetch({ autoFetch: false });

  const dataDeleteClothe = responseDeleteClothe.data;
  const loadingDeleteClothe = responseDeleteClothe.loading;
  const errorDeleteClothe = responseDeleteClothe.error;
  const refetch = responseDeleteClothe.refetch;

  useEffect(() => {
    setClothes(dataClothes);
  }, [dataClothes])

  const handleOpenEdit = () => {
    const modal = document.querySelector("#modalEdit");
    modal.showModal();
  }

  const handleCloseEdit = () => {
    const modal = document.querySelector("#modalEdit");
    modal.close();
  }

  const handleDelete = async (id) => {
    refetch({
      url: `http://localhost:3000/api/prendas/${id}`,
      options: {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        }
      }
    })

    if (!errorDeleteClothe) {
      setClothes(clothes.filter(clothe => clothe.id !== id));
    }
  }

  if (loadingClothes) return <h1>Cargando...</h1>;

  if (errorClothes) return <h1>Error: {errorClothes}</h1>;

  return (
    <main>
      <h1>Dashboard</h1>
      <h2>Prendas</h2>
      {clothes &&
        clothes.map((clothe, index) => (
          <div key={index}>
            <header>
              <div>
                <img
                  src={clothe.imagenes}
                  alt={`Imagen de la prenda ${clothe.nombre}`}
                />
                <h3>{clothe.nombre}</h3>
              </div>
              <div>
                <button onClick={handleOpenEdit}>Editar</button>
                <button onClick={() => handleDelete(clothe.id)}>Eliminar</button>
                <button>Crear</button>
              </div>
            </header>
            <main>
              <dialog id="modalEdit">
                <h4>Editar Prenda</h4>
                <button onClick={handleCloseEdit}>Cerrar</button>
                <button>Guardar</button>
              </dialog>
            </main>
          </div>
        ))}
    </main>
  );
};
