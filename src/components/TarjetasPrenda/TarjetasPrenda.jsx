import placeholderImg from "../../assets/placeholder.png";
import "./TarjetasPrenda.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppRoutes } from "../../models/routes.models";

const TarjetasPrenda = ({ prenda }) => {
  const [imgSrc, setImgSrc] = useState(prenda.imagenes);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/prenda/${prenda.id}`);
  };

  return (
    <div className="tarjeta-prenda" onClick={handleClick}>
      <div className="tarjeta-img-container">
        {prenda.imagenes ? (
          <img
          src={imgSrc}
          alt={prenda.nombre}
          className="tarjeta-img"
          onError={() => setImgSrc(placeholderImg)}
        />
        ) : (
          <img
            src={placeholderImg}
            alt="Imagen no disponible"
            className="tarjeta-img-placeholder"
          />
        )}
      </div>
      <div className="tarjeta-info">
        <h3 className="tarjeta-nombre">{prenda.nombre}</h3>
        <p className="tarjeta-precio">${prenda.precio}</p>
        <p className="tarjeta-detalle">{prenda.detalle}</p>
      </div>
    </div>
  );
};

export default TarjetasPrenda;