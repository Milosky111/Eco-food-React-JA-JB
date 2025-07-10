import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  obtenerTotalProductos,
  getProductosByEmpresaPagina,
  PAGE_SIZE,
} from "../../services/productoService";

TablaProductos.propTypes = {
  userData: PropTypes.object,
  busqueda: PropTypes.string,
  eliminar: PropTypes.func.isRequired,
  abrirModal: PropTypes.func.isRequired,
};

export default function TablaProductos({ userData, busqueda, eliminar, abrirModal }) {
  const [total, setTotal] = useState(0);
  const [historial, setHistorial] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [productos, setProductos] = useState([]);
  const [sinMas, setSinMas] = useState(false);

  // Obtener total de productos al montar o cambiar búsqueda
  useEffect(() => {
    if (!userData) return;

    const fetchTotal = async () => {
      const cantidad = await obtenerTotalProductos(userData.uid, busqueda);
      setTotal(cantidad);
    };

    fetchTotal();
  }, [userData, busqueda]);

  // Obtener productos de una página
  useEffect(() => {
    if (!userData) return;

    const cargarPagina = async () => {
      let cursor = null;
      if (pagina > 0) {
        cursor = historial[pagina - 1] || null;
      }

      const { productos: nuevos, lastVisible } = await getProductosByEmpresaPagina(
        userData.uid,
        cursor,
        busqueda
      );

      setProductos(nuevos);

      setHistorial((prev) => {
        const copia = [...prev];
        copia[pagina] = lastVisible;
        return copia;
      });

      setSinMas(nuevos.length < PAGE_SIZE);
    };

    cargarPagina();
  }, [pagina, userData, busqueda]);

  return (
    <div className="row">
      <div className="col-12">
        <ul className="list-group mb-3">
          {productos.map((p, i) => (
            <li
              key={p.id || i}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {p.nombre} - ${p.precio}
              <div>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => abrirModal(p)}
                >
                  Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminar(p.id)}
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="col">
        <p>Total de productos: {total}</p>
      </div>

      <div className="col-auto">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${pagina < 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPagina((p) => p - 1)}>
                <i className="fa-solid fa-arrow-left"></i>
              </button>
            </li>
            <li className={`page-item ${sinMas ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPagina((p) => p + 1)}>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
