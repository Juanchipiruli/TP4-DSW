import { Link } from "react-router-dom";
import { useFetch } from "../../hooks/useFetch";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Dashboard.css";
import { CiEdit } from "react-icons/ci";
import { CiTrash } from "react-icons/ci";
import { CiCirclePlus } from "react-icons/ci";
import { IoReturnUpBack } from "react-icons/io5";
import { CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import { Error } from "../../components";

export const Dashboard = () => {
  const [clothes, setClothes] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [stocksView, setStocksView] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [error, setError] = useState(null);

  const { token } = useAuth();

  const handleView = (id) => {
    const modal = document.querySelector(id);
    modal.classList.toggle("show");
  };

  const responseDataClothes = useFetch({
    url: "http://localhost:3000/api/prendas/",
    options: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  });

  const responseTipos = useFetch({
    url: "http://localhost:3000/api/prendas/types/",
    options: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  });

  useEffect(() => {
    if (responseTipos.data) {
      setTipos(responseTipos.data);
    }
  }, [responseTipos.data]);

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
  }, [responseColors.data]);

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
  }, [responseSizes.data]);

  const responseCreateStock = useFetch({ autoFetch: false });

  const refetchCreateStock = responseCreateStock.refetch;

  const responseDataStocks = useFetch({ autoFetch: false });

  const refetchDataStocks = responseDataStocks.refetch;

  useEffect(() => {
    setClothes(dataClothes);
  }, [dataClothes]);

  const responseEditStock = useFetch({ autoFetch: false });
  const refetchEditStock = responseEditStock.refetch;

  const handleOpenEdit = (id, prendaId = null) => {
    if (prendaId) {
      const modal = document.querySelector(`#modal${id}-${prendaId}`);
      modal.showModal();
    } else {
      const modal = document.querySelector(`#modal${id}`);
      modal.showModal();
    }
  };

  const handleCloseEdit = (id, prendaId = null) => {
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

  const responseCreatePrenda = useFetch({ autoFetch: false });

  const refetchCreatePrenda = responseCreatePrenda.refetch;

  const handleCreate = async (id) => {
    const panelCreate = document.querySelector(`#panelCreate-${id}`);

    panelCreate.classList.toggle("show");
  };

  const handleCreatePrenda = async () => {
    const nombreValue = document
      .querySelector("#modalCreate #nombre")
      .value.trim();
    const marcaValue = document.querySelector("#modalCreate #marca").value;
    const tipoValue = document.querySelector("#modalCreate #tipo").value;
    const precioValue = parseFloat(
      document.querySelector("#modalCreate #precio").value
    );
    const imagenesValue = document
      .querySelector("#modalCreate #imagenes")
      .value.trim();

    // Validar campos obligatorios
    if (
      !nombreValue ||
      !marcaValue ||
      isNaN(precioValue) ||
      precioValue <= 0 ||
      !tipoValue
    ) {
      setError(
        "Los campos nombre, marca, precio y tipo son obligatorios. El precio debe ser mayor a 0"
      );
      setTimeout(() => {
        setError(null);
      }, 3000);
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
          tipo: tipoValue,
          ...(imagenesValue && { imagenes: imagenesValue }),
        }),
      },
    });
  };

  useEffect(() => {
    if (responseCreatePrenda.data) {
      setClothes((prevClothes) => [...prevClothes, responseCreatePrenda.data]);
      handleCloseEdit("Create");
    }
  }, [responseCreatePrenda.data]);

  const responseUpdatePrenda = useFetch({ autoFetch: false });
  const refetchUpdatePrenda = responseUpdatePrenda.refetch;

  const handleUpdatePrenda = async (id) => {
    const nombreValue = document
      .querySelector(`#modalEdit-${id} #nombre`)
      .value.trim();
    const tipoValue = document.querySelector(`#modalEdit-${id} #tipo`).value;
    const marcaValue = document.querySelector(`#modalEdit-${id} #marca`).value;
    const precioValue = parseFloat(
      document.querySelector(`#modalEdit-${id} #precio`).value
    );
    const imagenesValue = document
      .querySelector(`#modalEdit-${id} #imagenes`)
      .value.trim();

    const body = {
      ...(nombreValue && { nombre: nombreValue }),
      ...(tipoValue && { tipo: tipoValue }),
      ...(marcaValue && { marca_id: marcaValue }),
      ...(precioValue && { precio: precioValue }),
      ...(imagenesValue && { imagenes: imagenesValue }),
    };

    await refetchUpdatePrenda({
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
  };

  useEffect(() => {
    if (responseUpdatePrenda.data) {
      setClothes((prevClothes) =>
        prevClothes.map((clothe) =>
          clothe.id === responseUpdatePrenda.data.id
            ? responseUpdatePrenda.data
            : clothe
        )
      );
      handleCloseEdit("Edit", responseUpdatePrenda.data.id);
    }
  }, [responseUpdatePrenda.data]);

  const handleSaveStock = async (id) => {
    const cantidadValue = document.querySelector(`#cantidad${id}`).value;
    const talleValue = document.querySelector(`#talle${id}`).value;
    const colorValue = document.querySelector(`#color${id}`).value;

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
      if (!stocks[id]) {
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
        setStocks((prevStocks) => ({
          ...prevStocks,
          [responseDataStocks.data[0].prenda_id]: responseDataStocks.data,
        }));
      }
    }
  }, [responseDataStocks.data]);

  useEffect(() => {
    if (responseCreateStock.data) {
      handleCreate(responseCreateStock.data.stock.prenda_id);
      setStocks((prevStocks) => ({
        ...prevStocks,
        [responseCreateStock.data.stock.prenda_id]: [
          ...(prevStocks[responseCreateStock.data.stock.prenda_id] || []),
          responseCreateStock.data.stock,
        ],
      }));
    }
  }, [responseCreateStock.data]);

  const handleEditStock = (id, idPrenda) => {
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
      },
    });

    handleView(`#modalEditStock-${id}`);
  };

  useEffect(() => {
    if (responseEditStock.data) {
      const updateStock = stocks[responseEditStock.data.stock.prenda_id].map((stock) =>
        stock.id === responseEditStock.data.stock.id ? { ...stock, ...{ cantidad: responseEditStock.data.stock.cantidad } } : stock
      );
      setStocks((prevStock) => ({
        ...prevStock,
        [responseEditStock.data.stock.prenda_id]: updateStock,
      }));
    }
  }, [responseEditStock.data])

  const responseCreateColor = useFetch({ autoFetch: false });

  const refetchCreateColor = responseCreateColor.refetch;

  const handleSaveColor = async () => {
    const nombre = document.querySelector("#nombreColor").value;
    const colorPicker = document.querySelector("#colorPicker").value;

    const colorPickerValue = colorPicker.replace("#", "");

    await refetchCreateColor({
      url: "http://localhost:3000/api/colores/",
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre, codigo_hex: colorPickerValue }),
      },
    });
  };

  useEffect(() => {
    if (responseCreateColor.data) {
      setColors((prev) => [...prev, responseCreateColor.data]);
      handleView("#modalCreateColor");
    }
  }, [responseCreateColor.data]);

  const responseDeleteColor = useFetch({ autoFetch: false });
  const refetchDeleteColor = responseDeleteColor.refetch;

  const handleDeleteColor = async (id) => {
    await refetchDeleteColor({
      url: `http://localhost:3000/api/colores/${id}`,
      options: {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    });
  };

  useEffect(() => {
    if (responseDeleteColor.data) {
      setColors((prev) =>
        prev.filter((color) => color.id !== responseDeleteColor.data.color.id)
      );
    }
  }, [responseDeleteColor.data]);

  const responseCreateSize = useFetch({ autoFetch: false });
  const refetchCreateSize = responseCreateSize.refetch;

  const handleSaveSize = async () => {
    const nombre = document.querySelector("#nombreTalle").value;

    await refetchCreateSize({
      url: "http://localhost:3000/api/talles/",
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre }),
      },
    });
  };

  useEffect(() => {
    if (responseCreateSize.data) {
      setSizes((prev) => [...prev, responseCreateSize.data]);
      handleView("#modalCreateSize");
    }
  }, [responseCreateSize.data]);

  const responseDeleteSize = useFetch({ autoFetch: false });
  const refetchDeleteSize = responseDeleteSize.refetch;

  const handleDeleteSize = async (id) => {
    await refetchDeleteSize({
      url: `http://localhost:3000/api/talles/${id}`,
      options: {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    });
  };

  useEffect(() => {
    if (responseDeleteSize.data) {
      setSizes((prev) =>
        prev.filter((size) => size.id !== responseDeleteSize.data.talle.id)
      );
    }
  }, [responseDeleteSize.data]);

  const responseCreateMarca = useFetch({ autoFetch: false });
  const refetchCreateMarca = responseCreateMarca.refetch;

  const handleSaveMarca = async () => {
    const nombre = document.querySelector("#nombreMarca").value;
    await refetchCreateMarca({
      url: "http://localhost:3000/api/marcas/",
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre }),
      },
    });
  };

  useEffect(() => {
    if (responseCreateMarca.data) {
      setMarcas((prev) => [...prev, responseCreateMarca.data]);
      handleView("#modalCreateMarca");
    }
  }, [responseCreateMarca.data]);

  const responseDeleteMarca = useFetch({ autoFetch: false });
  const refetchDeleteMarca = responseDeleteMarca.refetch;

  const handleDeleteMarca = async (id) => {
    await refetchDeleteMarca({
      url: `http://localhost:3000/api/marcas/${id}`,
      options: {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    });
  };

  useEffect(() => {
    if (responseDeleteMarca.data) {
      setMarcas((prev) =>
        prev.filter((marca) => marca.id !== responseDeleteMarca.data.marca.id)
      );
    }
  }, [responseDeleteMarca.data]);

  const responseUpdateMarca = useFetch({ autoFetch: false });
  const refetchUpdateMarca = responseUpdateMarca.refetch;

  const handleSaveUpdateMarca = async (id) => {
    const nombre = document.querySelector(`#nombreMarca${id}`).value;
    await refetchUpdateMarca({
      url: `http://localhost:3000/api/marcas/${id}`,
      options: {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre }),
      },
    });
  };

  useEffect(() => {
    if (responseUpdateMarca.data) {
      setMarcas((prev) =>
        prev.map((marca) =>
          marca.id === responseUpdateMarca.data.id
            ? responseUpdateMarca.data
            : marca
        )
      );
      handleView(`#modalEditMarca${responseUpdateMarca.data.id}`);
    }
  }, [responseUpdateMarca.data]);

  const responseUpdateSize = useFetch({ autoFetch: false });
  const refetchUpdateSize = responseUpdateSize.refetch;

  const handleSaveUpdateSize = async (id) => {
    const nombre = document.querySelector(`#nombreSize${id}`).value;
    await refetchUpdateSize({
      url: `http://localhost:3000/api/talles/${id}`,
      options: {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre }),
      },
    });
  };

  useEffect(() => {
    if (responseUpdateSize.data) {
      setSizes((prev) =>
        prev.map((size) =>
          size.id === responseUpdateSize.data.id
            ? responseUpdateSize.data
            : size
        )
      );
      handleView(`#modalEditSize${responseUpdateSize.data.id}`);
    }
  }, [responseUpdateSize.data]);

  const responseUpdateColor = useFetch({ autoFetch: false });
  const refetchUpdateColor = responseUpdateColor.refetch;

  const handleSaveUpdateColor = async (id) => {
    const nombre = document.querySelector(`#nombreColor${id}`).value;
    const colorPicker = document.querySelector(`#colorPicker${id}`).value;

    const color = colorPicker.replace("#", "");

    const body = {
      ...(nombre && { nombre: nombre }),
      ...(color && { codigo_hex: color }),
    };
    await refetchUpdateColor({
      url: `http://localhost:3000/api/colores/${id}`,
      options: {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      },
    });
  };

  useEffect(() => {
    if (responseUpdateColor.data) {
      setColors((prev) =>
        prev.map((color) =>
          color.id === responseUpdateColor.data.id
            ? responseUpdateColor.data
            : color
        )
      );
      handleView(`#modalEditColor${responseUpdateColor.data.id}`);
    }
  }, [responseUpdateColor.data]);

  const responseDeleteStock = useFetch({ autoFetch: false });
  const refetchDeleteStock = responseDeleteStock.refetch;

  const handleDeleteStock = async (id) => {
    await refetchDeleteStock({
      url: `http://localhost:3000/api/stocks/${id}`,
      options: {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    });
  };

  useEffect(() => {
    if (responseDeleteStock.data) {
      setStocks(prevStocks => ({
        ...prevStocks, [responseDeleteStock.data.stock.prenda_id]: prevStocks[responseDeleteStock.data.stock.prenda_id].filter(stock => stock.id !== responseDeleteStock.data.stock.id)
      }))
    }
  }, [responseDeleteStock.data]);

  if (loadingClothes) return <h1>Cargando...</h1>;

  if (errorClothes) return <h1>Error: {errorClothes}</h1>;

  return (
    <main>
      <div className="dashboard-title-container">
        <Link to="/">
          <button className="dashboard-clothe-button">
            <IoReturnUpBack />
          </button>
        </Link>
        <h1>Dashboard</h1>
      </div>
      <header className="dashboard-header">
        <h2>Prendas</h2>
        <button
          className="dashboard-clothe-button"
          onClick={() => handleOpenEdit("Create")}
        >
          <CiCirclePlus />
        </button>
        <dialog id="modalCreate">
          <h4>Crear Prenda</h4>
          <div className="modalCreate-form">
            <form>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Nombre"
              />
              <select id="tipo">
                {tipos.map((tipo) => (
                  <option key={`${tipo}`} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
              <select id="marca">
                {marcas.map((marca) => (
                  <option
                    key={`${marca.id} + ${marca.nombre}`}
                    value={marca.id}
                  >
                    {marca.nombre}
                  </option>
                ))}
              </select>
              <input
                type="number"
                id="precio"
                name="precio"
                placeholder="Precio"
              />
              <input
                type="text"
                id="imagenes"
                name="imagenes"
                placeholder="URL de la imagen"
              />
            </form>
            {error && <Error text={error} />}
          </div>
          <div className="buttons-container">
            <button onClick={() => handleCloseEdit("Create")}>Cerrar</button>
            <button onClick={() => handleCreatePrenda()}>Guardar</button>
          </div>
        </dialog>
      </header>
      {clothes &&
        clothes.map((clothe) => (
          <div
            key={`${clothe.id} ${clothe.nombre}`}
            className="dashboard-clothe"
          >
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
                <p>{clothe.Marca.nombre}</p>
                <p>{clothe.tipo}</p>
              </div>
              <div className="dashboard-clothe-buttons">
                <button
                  className="dashboard-clothe-button"
                  id="edit"
                  onClick={() => handleOpenEdit("Edit", clothe.id)}
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
              <dialog id={`modalEdit-${clothe.id}`}>
                <div className="modalEdit">
                  <h4>Editar Prenda</h4>
                  <div className="modalEdit-form">
                    <form>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        placeholder="Nombre"
                      />
                      <select id="tipo">
                        {tipos.map((tipo) => (
                          <option key={`${tipo}`} value={tipo}>
                            {tipo}
                          </option>
                        ))}
                      </select>
                      <select id="marca">
                        {marcas.map((marca) => (
                          <option
                            key={`${marca.id} + ${marca.nombre}`}
                            value={marca.id}
                          >
                            {marca.nombre}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        id="precio"
                        name="precio"
                        placeholder="Precio"
                      />
                      <input
                        type="text"
                        id="imagenes"
                        name="imagenes"
                        placeholder="URL de la imagen"
                      />
                    </form>
                  </div>
                  <div className="buttons-container">
                    <button onClick={() => handleCloseEdit("Edit", clothe.id)}>
                      Cerrar
                    </button>
                    <button onClick={() => handleUpdatePrenda(clothe.id)}>
                      Guardar
                    </button>
                  </div>
                </div>
              </dialog>

              <header className="panelCreate" id={`panelCreate-${clothe.id}`}>
                <div className="panelCreate-container">
                  <h4>Crear Stocks</h4>
                  <div className="panelCreate-form">
                    <label htmlFor="cantidad">Cantidad:</label>
                    <input
                      type="number"
                      id={`cantidad${clothe.id}`}
                      name="cantidad"
                      min={1}
                    />
                  </div>
                  <div className="panelCreate-form">
                    <label htmlFor="color">Color:</label>
                    <select name="color" id={`color${clothe.id}`}>
                      {colors.map((color, index) => (
                        <option key={index} value={color.id}>
                          {color.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="panelCreate-form">
                    <label htmlFor="talle">Talle:</label>
                    <select name="talle" id={`talle${clothe.id}`}>
                      {sizes.map((size, index) => (
                        <option key={index} value={size.id}>
                          {size.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="buttons-container">
                  <button
                    className="dashboard-clothe-button"
                    onClick={() => handleCreate(clothe.id)}
                  >
                    <CiCircleRemove />
                  </button>
                  <button
                    className="dashboard-clothe-button"
                    onClick={() => handleSaveStock(clothe.id)}
                  >
                    <CiCircleCheck />
                  </button>
                </div>
              </header>
            </main>
            {stocks[clothe.id] && stocksView.includes(clothe.id) ? (
              <div className="dashboard-stocks-container">
                <h5 className="dashboard-stocks-title">Stocks</h5>
                <ul className="dashboard-stocks-list">
                  {stocks[clothe.id].map((stock) => (
                    <li
                      key={`${stock.Color.nombre}${stock.Talle.nombre}${stock.Prenda.nombre}`}
                      className="dashboard-stock-item"
                    >
                      <div className="dashboard-stock-item-info">
                        <img
                          src={stock.Prenda.imagenes}
                          alt={`Imagen de la prenda ${stock.Prenda.nombre}`}
                        />
                        <p>Cantidad: {stock.cantidad}</p>
                        <p>Color: {stock.Color.nombre}</p>
                        <p>Talle: {stock.Talle.nombre}</p>
                      </div>
                      <div className="dashboard-stock-item-buttons">
                        <button
                          className="dashboard-clothe-button"
                          onClick={() =>
                            handleView(`#modalEditStock-${stock.id}`)
                          }
                        >
                          <CiEdit />
                        </button>
                        <div
                          className="modalEditStock"
                          id={`modalEditStock-${stock.id}`}
                        >
                          <input
                            type="number"
                            id={`edit${stock.id}`}
                            placeholder="cantidad"
                          />
                          <button
                            className="dashboard-clothe-button"
                            onClick={() =>
                              handleEditStock(stock.id, stock.Prenda.id)
                            }
                          >
                            <CiCircleCheck />
                          </button>

                          <button
                            className="dashboard-clothe-button"
                            onClick={() => handleDeleteStock(stock.id)}
                          >
                            <CiTrash />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ))}
      <div className="dashboard-colors-y-sizes">
        <div className="dashboard-colors-container">
          <h2>Colores</h2>
          <button
            className="dashboard-clothe-button"
            onClick={() => handleView("#modalCreateColor")}
          >
            <CiCirclePlus />
          </button>
          <div id="modalCreateColor">
            <label htmlFor="colorPicker">Elige un color:</label>
            <input
              type="color"
              id="colorPicker"
              name="color"
              defaultValue="#ff0000"
            />
            <label htmlFor="nombreColor">Nombre:</label>
            <input type="text" id="nombreColor" name="color" />
            <button
              className="dashboard-clothe-button"
              onClick={handleSaveColor}
            >
              <CiCircleCheck />
            </button>
          </div>
          <div className="dashboard-general-container">
            <div className="dashboard-general-subcontainer">
              {colors &&
                colors.map((color) => (
                  <section
                    key={color.codigo_hex}
                    className="dashboard-general-item"
                  >
                    <div className="dashboard-general-item-info">
                      <div
                        className="color-hex"
                        style={{
                          backgroundColor: `#${color.codigo_hex}`,
                          width: "30px",
                          height: "30px",
                          borderRadius: "7px",
                        }}
                      ></div>
                      <p>{color.nombre}</p>
                      <div className="dashboard-clothe-buttons">
                        <button
                          className="dashboard-clothe-button"
                          onClick={() => handleDeleteColor(color.id)}
                        >
                          <CiTrash />
                        </button>
                        <button
                          className="dashboard-clothe-button"
                          onClick={() =>
                            handleView(`#modalEditColor${color.id}`)
                          }
                        >
                          <CiEdit />
                        </button>
                      </div>
                    </div>
                    <div
                      className="modalEditMarca"
                      id={`modalEditColor${color.id}`}
                    >
                      <label htmlFor="colorPicker">Elige un color:</label>
                      <input
                        type="color"
                        id={`colorPicker${color.id}`}
                        name="color"
                        defaultValue="#ff0000"
                      />
                      <label htmlFor="nombreColor">Nombre:</label>
                      <input
                        type="text"
                        id={`nombreColor${color.id}`}
                        name="color"
                      />
                      <button
                        className="dashboard-clothe-button"
                        onClick={() => handleSaveUpdateColor(color.id)}
                      >
                        <CiCircleCheck />
                      </button>
                    </div>
                  </section>
                ))}
            </div>
            {responseDeleteColor.error && (
              <Error text={responseDeleteColor.error} />
            )}
          </div>
        </div>
        <div className="dashboard-colors-container">
          <div className="dashboard-colors-container">
            <h2>Talles</h2>
            <button
              className="dashboard-clothe-button"
              onClick={() => handleView("#modalCreateSize")}
            >
              <CiCirclePlus />
            </button>
            <div id="modalCreateSize">
              <label htmlFor="nombreTalle">Nombre:</label>
              <input type="text" id="nombreTalle" name="talle" />
              <button
                className="dashboard-clothe-button"
                onClick={handleSaveSize}
              >
                <CiCircleCheck />
              </button>
            </div>
          </div>
          <div
            className="dashboard-general-container"
            id="dashboard-general-container-sizes"
          >
            <div className="dashboard-general-subcontainer">
              {sizes &&
                sizes.map((size) => (
                  <section key={size.nombre} className="dashboard-general-item">
                    <div className="dashboard-general-item-info">
                      <p>{size.nombre.toUpperCase()}</p>
                      <div className="dashboard-clothe-buttons">
                        <button
                          className="dashboard-clothe-button"
                          onClick={() => handleDeleteSize(size.id)}
                        >
                          <CiTrash />
                        </button>
                        <button
                          className="dashboard-clothe-button"
                          onClick={() => handleView(`#modalEditSize${size.id}`)}
                        >
                          <CiEdit />
                        </button>
                      </div>
                    </div>
                    <div
                      className="modalEditMarca"
                      id={`modalEditSize${size.id}`}
                    >
                      <label htmlFor="nombreSize">Nombre:</label>
                      <input
                        type="text"
                        id={`nombreSize${size.id}`}
                        name="size"
                      />
                      <button
                        className="dashboard-clothe-button"
                        onClick={() => handleSaveUpdateSize(size.id)}
                      >
                        <CiCircleCheck />
                      </button>
                    </div>
                  </section>
                ))}
            </div>
          </div>
          {responseDeleteSize.error && (
            <Error text={responseDeleteSize.error} />
          )}
        </div>
      </div>
      <div className="dashboard-colors-container">
        <h2>Marcas</h2>
        <button
          className="dashboard-clothe-button"
          onClick={() => handleView("#modalCreateMarca")}
        >
          <CiCirclePlus />
        </button>
        <div id="modalCreateMarca">
          <label htmlFor="nombreMarca">Nombre:</label>
          <input type="text" id="nombreMarca" name="marca" />
          <button
            className="dashboard-clothe-button"
            onClick={() => handleSaveMarca()}
          >
            <CiCircleCheck />
          </button>
        </div>
        <div className="dashboard-general-container">
          <div className="dashboard-general-subcontainer">
            {marcas &&
              marcas.map((marca) => (
                <section
                  key={`${marca.id} ${marca.nombre}`}
                  className="dashboard-general-item"
                >
                  <div className="dashboard-general-item-info">
                    <p>{marca.nombre}</p>
                    <div className="dashboard-clothe-buttons">
                      <button
                        className="dashboard-clothe-button"
                        onClick={() => handleDeleteMarca(marca.id)}
                      >
                        <CiTrash />
                      </button>
                      <button
                        className="dashboard-clothe-button"
                        onClick={() => handleView(`#modalEditMarca${marca.id}`)}
                      >
                        <CiEdit />
                      </button>
                    </div>
                  </div>
                  <div
                    className="modalEditMarca"
                    id={`modalEditMarca${marca.id}`}
                  >
                    <label htmlFor="nombreMarca">Nombre:</label>
                    <input
                      type="text"
                      id={`nombreMarca${marca.id}`}
                      name="marca"
                    />
                    <button
                      className="dashboard-clothe-button"
                      onClick={() => handleSaveUpdateMarca(marca.id)}
                    >
                      <CiCircleCheck />
                    </button>
                  </div>
                </section>
              ))}
          </div>
        </div>
        {responseDeleteMarca.error && (
          <Error text={responseDeleteMarca.error} />
        )}
      </div>
    </main>
  );
};
