import { Link } from "react-router-dom";
import { AppRoutes } from "../../models/routes.models";
import { useFetch } from "../../hooks/useFetch";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import './Dashboard.css';
import { CiEdit } from "react-icons/ci";
import { CiTrash } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";

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

  const handleOpenEdit = (id) => {
    const modal = document.querySelector(`#modal${id}`);
    modal.showModal();
  }

  const handleCloseEdit = (id) => {
    const modal = document.querySelector(`#modal${id}`);
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

  const handleCreate = async (id) => {
    const panelCreate = document.querySelector(`#panelCreate-${id}`);

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

  const handleCreatePrenda = () => {
    const panelCreate = document.querySelector('#panelCreate');
    panelCreate.classList.toggle('show');
  }

  if (loadingClothes) return <h1>Cargando...</h1>;

  if (errorClothes) return <h1>Error: {errorClothes}</h1>;

  return (
    <main>
      <h1>Dashboard</h1>
      <header className="dashboard-header">
        <h2>Prendas</h2>
        <button onClick={() => handleOpenEdit("Create")}><CiCirclePlus /></button>
      </header>
      {clothes &&
        clothes.map((clothe, index) => (
          <div key={index} className="dashboard-clothe">
            <header>
              <div className="dashboard-clothe-info">
                <img
                  src={clothe.imagenes}
                  alt={`Imagen de la prenda ${clothe.nombre}`}
                />
                <h3>{clothe.nombre}</h3>
              </div>
              <div className="dashboard-clothe-buttons">
                <button id="edit" onClick={() => handleOpenEdit("Edit")}><CiEdit /></button>
                <button onClick={() => handleDelete(clothe.id)}><CiTrash /></button>
                <button onClick={() => handleCreate(clothe.id)}><CiCirclePlus /></button>
              </div>
            </header>
            <main>
              <dialog id="modalEdit">
                <h4>Editar Prenda</h4>
                <button onClick={() => handleCloseEdit("Edit")}>Cerrar</button>
                <button>Guardar</button>
              </dialog>
              <dialog id="modalCreate">
                <h4>Crear Prenda</h4>
                <button onClick={() => handleCloseEdit("Create")}>Cerrar</button>
                <button>Guardar</button>
              </dialog>
              <header className="panelCreate" id={`panelCreate-${clothe.id}`}>
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
