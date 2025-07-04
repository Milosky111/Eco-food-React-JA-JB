import { useState, useEffect } from "react";
import { getProductosPorEmpresa, addProducto, eliminarProducto } from "../services/productosfirebase";

export default function ProductosPorEmpresa({ empresaId }) {
  const [productos, setProductos] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState("");

  useEffect(() => {
    if (empresaId) {
      cargarProductos();
    } else {
      setProductos([]);
    }
  }, [empresaId]);

  const cargarProductos = async () => {
    try {
      const data = await getProductosPorEmpresa(empresaId);
      setProductos(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  const agregarProducto = async () => {
    if (!nuevoNombre.trim()) return;

    try {
      await addProducto({ nombre: nuevoNombre.trim(), empresaId });
      setNuevoNombre("");
      cargarProductos();
    } catch (error) {
      console.error("Error agregando producto:", error);
    }
  };

  const eliminar = async (id) => {
    try {
      await eliminarProducto(id);
      cargarProductos();
    } catch (error) {
      console.error("Error eliminando producto:", error);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Productos de la empresa</h3>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Nombre del producto"
          value={nuevoNombre}
          onChange={(e) => setNuevoNombre(e.target.value)}
        />
        <button className="btn btn-primary" onClick={agregarProducto}>
          Agregar Producto
        </button>
      </div>

      <ul className="list-group">
        {productos.map((p) => (
          <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
            {p.nombre}
            <button className="btn btn-danger btn-sm" onClick={() => eliminar(p.id)}>
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}