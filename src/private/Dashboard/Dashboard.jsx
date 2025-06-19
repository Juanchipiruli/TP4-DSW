import { Link } from "react-router-dom";
import { AppRoutes } from "../../models/routes.models";
import { useFetch } from "../../hooks/useFetch";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Dashboard.css";
import { CiEdit } from "react-icons/ci";
import { CiTrash } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";

export const Dashboard = () => {
  const [clothes, setClothes] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [stocksView, setStocksView] = useState([]);
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

  useEffect(() => {
    setClothes(dataClothes);
  }, [dataClothes]);

  const responseDeleteClothe = useFetch({ autoFetch: false });

  const errorDeleteClothe = responseDeleteClothe.error;
  const refetch = responseDeleteClothe.refetch;

  const responseColors = useFetch({
    url: "http://localhost:3000/api/colores/",
    options: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  });

  useEffect(() => {
    if (responseColors.data) {
      setColors(responseColors.data);
    }
  }, [responseColors]);

  const responseSizes = useFetch({
    url: "http://localhost:3000/api/talles/",
    options: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  });

  useEffect(() => {
    if (responseSizes.data) {
      setSizes(responseSizes.data);
    }
  }, [responseSizes]);

  const responseCreateStock = useFetch({ autoFetch: false });

  const refetchCreateStock = responseCreateStock.refetch;

  const responseDataStocks = useFetch({ autoFetch: false });

  const refetchDataStocks = responseDataStocks.refetch;

  const responseEditStock = useFetch({ autoFetch: false });
  const refetchEditStock = responseEditStock.refetch;

  const handleOpenEdit = (id) => {
    const modal = document.querySelector(`#modal${id}`);
    modal.showModal();
  };

  const handleCloseEdit = (id) => {
    const modal = document.querySelector(`#modal${id}`);
    modal.close();
  };

  const handleDelete = async (id) => {
    await refetch({
      url: `http://localhost:3000/api/prendas/${id}`,
      options: {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    });

    if (!errorDeleteClothe) {
      setClothes(clothes.filter((clothe) => clothe.id !== id));
    }
  };

  const handleCreate = async (id) => {
    const panelCreate = document.querySelector(`#panelCreate-${id}`);
    panelCreate.classList.toggle("show");
  };

  const handleCreatePrenda = () => {
    const panelCreate = document.querySelector("#panelCreate");
    panelCreate.classList.toggle("show");
  };

  const handleSaveStock = async (id) => {
    const cantidadValue = document.querySelector("#cantidad").value;
    const talleValue = document.querySelector("#talle").value;
    const colorValue = document.querySelector("#color").value;

    await refetchCreateStock({
      url: "http://localhost:3000/api/stocks/",
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prenda_id: id,
          cantidad: cantidadValue,
          talle_id: talleValue,
          color_id: colorValue,
          disponible: true,
        }),
      },
    });
  };

  const handleViewStocks = async (id) => {
    if (!stocksView.includes(id)) {
      if (!stocks.length) {
        await refetchDataStocks({
          url: `http://localhost:3000/api/stocks/product/${id}`,
          options: {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        });
      }

      setStocksView((prev) => [...prev, id]);
    } else {
      setStocksView((prev) => prev.filter((pre) => pre !== id));
    }
  };

  useEffect(() => {
    if (responseDataStocks.data) {
      if (responseDataStocks.data.length) {
        console.log("Guardando: ", responseDataStocks.data);
        setStocks((prev) => [...prev, responseDataStocks.data[0]]);
      }
    }
  }, [responseDataStocks.data]);

  useEffect(() => {
    if (responseCreateStock.data) {
      console.log("Stock creado: ", responseCreateStock.data);
      setStocks((prev) => [...prev, responseCreateStock.data[0]]);
    }
  }, [responseCreateStock.data]);

  const handleOpenEditStock = (id) => {
    const modalEditStock = document.querySelector(`#modalEditStock-${id}`);
    modalEditStock.classList.toggle("show");
  }

  const handleEditStock = (id) => {
    const editValue = document.querySelector(`#edit${id}`).value;

    refetchEditStock({
      url: `http://localhost:3000/api/stocks/${id}`,
      options: {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cantidad: editValue,
        }),
      }
    });

    const updateStock = stocks.map(stock => 
      stock.id === id ? { ...stock, ...{ cantidad: editValue } } : stock
    );
    setStocks(updateStock);

    handleOpenEditStock(id);
  }

  if (loadingClothes) return <h1>Cargando...</h1>;

  if (errorClothes) return <h1>Error: {errorClothes}</h1>;

  return (
    <main>
      <h1>Dashboard</h1>
      <header className="dashboard-header">
        <h2>Prendas</h2>
        <button
          className="dashboard-clothe-button"
          onClick={() => handleOpenEdit("Create")}
        >
          <CiCirclePlus />
        </button>
      </header>
      {clothes &&
        clothes.map((clothe, index) => (
          <div key={index} className="dashboard-clothe">
            <header>
              <div
                className="dashboard-clothe-info"
                onClick={() => handleViewStocks(clothe.id)}
              >
                <img
                  src={clothe.imagenes}
                  alt={`Imagen de la prenda ${clothe.nombre}`}
                />
                <h3>{clothe.nombre}</h3>
              </div>
              <div className="dashboard-clothe-buttons">
                <button
                  className="dashboard-clothe-button"
                  id="edit"
                  onClick={() => handleOpenEdit("Edit")}
                >
                  <CiEdit />
                </button>
                <button
                  className="dashboard-clothe-button"
                  onClick={() => handleDelete(clothe.id)}
                >
                  <CiTrash />
                </button>
                <button
                  className="dashboard-clothe-button"
                  onClick={() => handleCreate(clothe.id)}
                >
                  <CiCirclePlus />
                </button>
              </div>
            </header>
            <main>
              <dialog id="modalEdit">
                <h4>Editar Prenda</h4>
                <button
                  className="dashboard-clothe-button"
                  onClick={() => handleCloseEdit("Edit")}
                >
                  Cerrar
                </button>
                <button className="dashboard-clothe-button">Guardar</button>
              </dialog>
              <dialog id="modalCreate">
                <h4>Crear Prenda</h4>
                <button
                  className="dashboard-clothe-button"
                  onClick={() => handleCloseEdit("Create")}
                >
                  Cerrar
                </button>
                <button className="dashboard-clothe-button">Guardar</button>
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
                    {colors.map((color, index) => (
                      <option key={index} value={color.id}>
                        {color.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="talle">Talle:</label>
                  <select name="talle" id="talle">
                    {sizes.map((size, index) => (
                      <option key={index} value={size.id}>
                        {size.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="dashboard-clothe-button"
                  onClick={() => handleCreate(clothe.id)}
                >
                  Cerrar
                </button>
                <button
                  className="dashboard-clothe-button"
                  onClick={() => handleSaveStock(clothe.id)}
                >
                  Guardar
                </button>
              </header>
            </main>
            {stocksView.includes(clothe.id) ? (
              <div>
                <h5>Stocks</h5>
                <ul>
                  {stocks.map((stock) => (
                    <li
                      key={`${stock.Color.nombre}${stock.Talle.nombre}${stock.Prenda.nombre}`}
                    >
                      <p>Cantidad: {stock.cantidad}</p>
                      <p>Color: {stock.Color.nombre}</p>
                      <p>Talle: {stock.Talle.nombre}</p>
                      <button onClick={() => handleOpenEditStock(stock.id)}>Editar</button>
                      <div className="modalEditStock" id={`modalEditStock-${stock.id}`}>
                        <input type="number" id={`edit${stock.id}`} placeholder="cantidad"/>
                        <button onClick={() => handleEditStock(stock.id)}>Guardar</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ))}
      <div>
        {colors &&
          colors.map((color) => (
            <article key={color.codigo_hex}>
              <div
                style={{
                  backgroundColor: `#${color.codigo_hex}`,
                  width: "50px",
                  height: "50px",
                }}
              ></div>
              <p>{color.nombre}</p>
            </article>
          ))}
        {sizes &&
          sizes.map((size) => (
            <article key={size.nombre}>
              <p>{size.nombre}</p>
            </article>
          ))}
      </div>
    </main>
  );
};
