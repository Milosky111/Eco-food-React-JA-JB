export default function CardProducto({ nombre, precio }) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-body d-flex flex-column justify-content-between">
        <h5 className="card-title">{nombre}</h5>
        <p className="card-text">{precio}</p>
        <button className="btn btn-primary mt-auto">Agregar al carrito</button>
      </div>
    </div>
  );
}