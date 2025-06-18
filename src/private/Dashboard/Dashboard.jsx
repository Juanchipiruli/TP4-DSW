import { Link } from "react-router-dom";
import { AppRoutes } from "../../models/routes.models";
import { useFetch } from "../../hooks/useFetch";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import './Dashboard.css';

export const Dashboard = () => {
  const [clothes, setClothes] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

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

  const responseColors = useFetch({ autoFetch: false });

  let dataColors = responseColors.data;
  let loadingColors = responseColors.loading;
  let errorColors = responseColors.error;
  const refetchColors = responseColors.refetch;

  useEffect(() => {
    dataColors = responseColors.data;
  }, [responseColors]);

  const responseSizes = useFetch({ autoFetch: false });

  let dataSizes = responseSizes.data;
  let loadingSizes = responseSizes.loading;
  let errorSizes = responseSizes.error;
  const refetchSizes = responseSizes.refetch;

  useEffect(() => {
    dataSizes = responseSizes.data;
  }, [responseSizes]);

  useEffect(() => {
    setClothes(dataClothes);
  }, [dataClothes])

  useEffect(() => {
    console.log("Colores: ", colors);
    if (dataColors) {
      setColors(dataColors);
    }
  }, [dataColors]);

  useEffect(() => {
    console.log("Talles: ", sizes);
    if (dataSizes) {
      setSizes(dataSizes);
    }
  }, [dataSizes])

  const handleOpenEdit = () => {
    const modal = document.querySelector("#modalEdit");
    modal.showModal();
  }

  const handleCloseEdit = () => {
    const modal = document.querySelector("#modalEdit");
    modal.close();
  }

  const handleDelete = async (id) => {
    await refetch({
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

  const handleCreate = async () => {
    const panelCreate = document.querySelector('#panelCreate');

    if (panelCreate !== "show") {
      await refetchColors({
        url: "http://localhost:3000/api/colores/",
        options: {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      });

      await refetchSizes({
        url: "http://localhost:3000/api/talles/",
        options: {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          }
        }
      });
    }

    panelCreate.classList.toggle('show');
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
                <button onClick={handleCreate}>Crear</button>
              </div>
            </header>
            <main>
              <dialog id="modalEdit">
                <h4>Editar Prenda</h4>
                <button onClick={handleCloseEdit}>Cerrar</button>
                <button>Guardar</button>
              </dialog>
              <header id="panelCreate">
                <h4>Crear Stocks</h4>
                <div>
                  <label htmlFor="cantidad">Cantidad:</label>
                  <input type="number" id="cantidad" name="cantidad" min={1} />
                </div>
                <div>
                  <label htmlFor="color">Color:</label>
                  <select name="color" id="color">
                    <option disabled defaultValue="">--Seleccione un color--</option>
                    {colors.map((color, index) => (
                      <option key={index} value={color.nombre}>{color.nombre}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="talle">Talle:</label>
                  <select name="talle" id="talle">
                    <option defaultValue="" disabled>--Seleccione un talle--</option>
                    {sizes.map((size, index) => (
                      <option key={index} value={size.nombre}>{size.nombre}</option>
                    ))}
                  </select>
                </div>
                <button onClick={handleCreate}>Cerrar</button>
              </header>
            </main>
          </div>
        ))}
    </main>
  );
};
