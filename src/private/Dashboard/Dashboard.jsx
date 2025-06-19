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
  const [marcas, setMarcas] = useState([]);

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

  const responseMarcas = useFetch({
    url: "http://localhost:3000/api/marcas/",
    options: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  });

  useEffect(() => {
    if (responseMarcas.data) {
      setMarcas(responseMarcas.data);
    }
  }, [responseMarcas.data]);

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

  const responseCreateStock = useFetch({ autoFetch: false });

  const refetchCreateStock = responseCreateStock.refetch;

  const responseDataStocks = useFetch({ autoFetch: false });

  const refetchDataStocks = responseDataStocks.refetch;

  const responseCreatePrenda = useFetch({autoFetch: false});

  const refetchCreatePrenda = responseCreatePrenda.refetch;

  const responseUpdatePrenda = useFetch({autoFetch: false});
  const refetchUpdatePrenda = responseUpdatePrenda.refetch;

  const dataCreatePrenda = responseCreatePrenda.data;

  

  useEffect(() => {
    setClothes(dataClothes);
  }, [dataClothes]);

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
  }, [dataSizes]);

  const handleOpenEdit = (id, prendaId= null) => {
    if (prendaId) {
      const modal = document.querySelector(`#modal${id}-${prendaId}`);
      modal.showModal();
    } else {
      const modal = document.querySelector(`#modal${id}`);
      modal.showModal();
    }
  };

  const handleCloseEdit = (id, prendaId= null) => {
    if (prendaId) {
      const modal = document.querySelector(`#modal${id}-${prendaId}`);
      modal.close();
    } else {
      const modal = document.querySelector(`#modal${id}`);
      modal.close();
    }
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

  const handleCreatePrenda = async() => {
    const nombreValue = document.querySelector("#modalCreate #nombre").value.trim();
    const marcaValue = document.querySelector("#modalCreate #marca").value;
    const descripcionValue = document.querySelector("#modalCreate #descripcion").value.trim();
    const precioValue = parseFloat(document.querySelector("#modalCreate #precio").value);
    const imagenesValue = document.querySelector("#modalCreate #imagenes").value.trim();

    // Validar campos obligatorios
    if (!nombreValue || !marcaValue || isNaN(precioValue) || precioValue <= 0) {
      alert("Los campos nombre, marca y precio son obligatorios. El precio debe ser mayor a 0");
      return;
    }

    await refetchCreatePrenda({
      url: "http://localhost:3000/api/prendas/",
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: nombreValue,
          marca_id: marcaValue,
          precio: precioValue,
          ...(descripcionValue && { descripcion: descripcionValue }),
          ...(imagenesValue && { imagenes: imagenesValue })
        }),
      },
    });
  };

  const handleUpdatePrenda = async(id) => {
    const nombreValue = document.querySelector(`#modalEdit-${id} #nombre`).value.trim();
    const descripcionValue= document.querySelector(`#modalEdit-${id} #descripcion`).value;
    const marcaValue = document.querySelector(`#modalEdit-${id} #marca`).value;
    const precioValue = parseFloat(document.querySelector(`#modalEdit-${id} #precio`).value);
    const imagenesValue = document.querySelector(`#modalEdit-${id} #imagenes`).value.trim();

    console.log("ID: ", id);

    const body = {
      ...(nombreValue && { nombre: nombreValue }),
      ...(descripcionValue && { descripcion: descripcionValue }),
      ...(marcaValue && { marca_id: marcaValue }),
      ...(precioValue && { precio: precioValue }),
      ...(imagenesValue && { imagenes: imagenesValue })
    };

    await refetchUpdatePrenda ({
      url: `http://localhost:3000/api/prendas/${id}`,
      options: {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      },
    });
  }

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
    console.log("ABRIR O CERRAR");
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
      setStocksView((prev) => prev.filter(pre => pre !== id));
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

  if (loadingClothes) return <h1>Cargando...</h1>;

  if (errorClothes) return <h1>Error: {errorClothes}</h1>;

  return (
    <main>
      <h1>Dashboard</h1>
      <header className="dashboard-header">
        <h2>Prendas</h2>
        <button className="dashboard-clothe-button" onClick={() => handleOpenEdit("Create")}>
          <CiCirclePlus />
        </button>
        <dialog id="modalCreate">
                <h4>Crear Prenda</h4>
                <div>
                  <form>
                    <input type="text" id="nombre" name="nombre" placeholder="Nombre" />
                    <input type="text" id="descripcion" name="descripcion" placeholder="Descripcion" />
                    <select id="marca">
                      {marcas.map((marca) => (
                        <option key={`${marca.id} + ${marca.nombre}`} value={marca.id}>
                          {marca.nombre}
                        </option>
                      ))}
                    </select>
                    <input type="number" id="precio" name="precio" placeholder="Precio" />
                    <input type="text" id="imagenes" name="imagenes" placeholder="URL de la imagen" />
                  </form>
                </div>
                <button className="dashboard-clothe-button" onClick={() => handleCloseEdit("Create")}>
                  Cerrar
                </button>
                <button className="dashboard-clothe-button" onClick={() => handleCreatePrenda()}>Guardar</button>
              </dialog>
      </header>
      {clothes &&
        clothes.map((clothe) => (
          <div
            key={`${clothe.id} ${clothe.nombre}`}
            className="dashboard-clothe"
          >
            <header>
              <div className="dashboard-clothe-info" onClick={() => handleViewStocks(clothe.id)}>
                <img
                  src={clothe.imagenes}
                  alt={`Imagen de la prenda ${clothe.nombre}`}
                />
                <h3>{clothe.nombre}</h3>
              </div>
              <div className="dashboard-clothe-buttons">
                <button className="dashboard-clothe-button" id="edit" onClick={() => handleOpenEdit("Edit", clothe.id)}>
                  <CiEdit />
                </button>
                <button className="dashboard-clothe-button" onClick={() => handleDelete(clothe.id)}>
                  <CiTrash />
                </button>
                <button className="dashboard-clothe-button" onClick={() => handleCreate(clothe.id)}>
                  <CiCirclePlus />
                </button>
              </div>
            </header>
            <main>
              <dialog id={`modalEdit-${clothe.id}`}>
                <h4>Editar Prenda</h4>
                <div>
                  <form>
                    <input type="text" id="nombre" name="nombre" placeholder="Nombre" />
                    <input type="text" id="descripcion" name="descripcion" placeholder="Descripcion" />
                    <select id="marca">
                      {marcas.map((marca) => (
                        <option key={`${marca.id} + ${marca.nombre}`} value={marca.id}>
                          {marca.nombre}
                        </option>
                      ))}
                    </select>
                    <input type="number" id="precio" name="precio" placeholder="Precio" />
                    <input type="text" id="imagenes" name="imagenes" placeholder="URL de la imagen" />
                  </form>
                </div>
                <button className="dashboard-clothe-button" onClick={() => handleCloseEdit("Edit", clothe.id)}>Cerrar</button>
                <button className="dashboard-clothe-button" onClick={() => handleUpdatePrenda(clothe.id)}>Guardar</button>
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
                <button className="dashboard-clothe-button" onClick={() => handleCreate(clothe.id)}>Cerrar</button>
                <button className="dashboard-clothe-button" onClick={() => handleSaveStock(clothe.id)}>
                  Guardar
                </button>
              </header>
            </main>
            {stocksView.includes(clothe.id) ? (
              <div>
                <h5>Stocks</h5>
                <ul>
                  {stocks.map((stock) => (
                    <li key={`${stock.Color.nombre}${stock.Talle.nombre}${stock.Prenda.nombre}`}>
                      <p>Cantidad: {stock.cantidad}</p>
                      <p>Color: {stock.Color.nombre}</p>
                      <p>Talle: {stock.Talle.nombre}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ): null}
          </div>
        ))}
    </main>
  );
};
