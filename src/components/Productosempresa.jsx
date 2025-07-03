import { useState, useEffect } from "react";
import { getProductosPorEmpresa, addProducto, eliminarProducto } from "../services/productosfirebase";

export default function ProductosPorEmpresa({ empresaId }) {
  const [productos, setProductos] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState("");

  useEffect(() => {
    if (empresaId) {
      cargarProductos();
    }               
  }, [empresaId]);

  const cargarProductos = async () => {
    const data = await getProductosPorEmpresa(empresaId);
    setProductos(data);
  };

  const agregarProducto = async () => {
    if (!nuevoNombre.trim()) return;
    await addProducto({ nombre: nuevoNombre, empresaId });
    setNuevoNombre("");
    cargarProductos();
  };

  const eliminar = async (id) => {
    await eliminarProducto(id);
    cargarProductos();
  };

  return (
    <div>
      <h3>Productos de la empresa</h3>
      <input
        value={nuevoNombre}
        onChange={e => setNuevoNombre(e.target.value)}
        placeholder="Nombre del producto"
      />
      <button onClick={agregarProducto}>Agregar Producto</button>
      <ul>
        {productos.map(p => (
          <li key={p.id}>
            {p.nombre}{" "}
            <button onClick={() => eliminar(p.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}