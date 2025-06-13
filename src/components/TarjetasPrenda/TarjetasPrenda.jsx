import "./TarjetasPrenda.css";

const TarjetasPrenda = ({ prenda }) => (
  <div className="tarjeta-prenda">
    <div className="tarjeta-img-container">
      <img src={prenda.imagenes} alt={prenda.nombre} className="tarjeta-img" />
    </div>
    <div className="tarjeta-info">
      <h3 className="tarjeta-nombre">{prenda.nombre}</h3>
      <p className="tarjeta-precio">${prenda.precio}</p>
      <p className="tarjeta-detalle">{prenda.detalle}</p>
    </div>
  </div>
);

export default TarjetasPrenda;
