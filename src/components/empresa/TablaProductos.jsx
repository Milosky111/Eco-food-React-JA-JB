import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  obtenerTotalProductos,
  getProductosByEmpresaPagina,
} from "../../services/productoService";

const PAGE_OPTIONS = [5, 10, 20];

TablaProductos.propTypes = {
  userData: PropTypes.object,
  busqueda: PropTypes.string,
  eliminar: PropTypes.func.isRequired,
  abrirModal: PropTypes.func.isRequired,
};

function calcularEstadoProducto(vencimiento) {
  if (!vencimiento) return "desconocido";

  const hoy = new Date();
  const fechaVenc = new Date(vencimiento);
  const diffMs = fechaVenc - hoy;
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias < 0) return "vencido";
  if (diffDias <= 3) return "por vencer";
  return "disponible";
}

export default function TablaProductos({ userData, busqueda, eliminar, abrirModal }) {
  const [total, setTotal] = useState(0);
  const [historial, setHistorial] = useState([]);
  const [pagina, setPagina] = useState(0);
  const [productos, setProductos] = useState([]);
  const [sinMas, setSinMas] = useState(false);

  // Nuevos estados para filtros y ordenamiento
  const [filtroEstado, setFiltroEstado] = useState("todos"); // "todos", "disponible", "por vencer", "vencido"
  const [ordenCampo, setOrdenCampo] = useState("nombre"); // "nombre" o "precio"
  const [ordenDireccion, setOrdenDireccion] = useState("asc"); // "asc" o "desc"
  const [pageSize, setPageSize] = useState(PAGE_OPTIONS[0]);

  // Obtener total de productos al montar o cambiar búsqueda, filtro o pageSize
  useEffect(() => {
    if (!userData) return;

    const fetchTotal = async () => {
      const cantidad = await obtenerTotalProductos(userData.uid, busqueda);
      setTotal(cantidad);
      setPagina(0); // Resetear a página 0 cuando cambian filtros/búsqueda
      setHistorial([]);
    };

    fetchTotal();
  }, [userData, busqueda, filtroEstado, pageSize]);

  // Obtener productos de una página
  useEffect(() => {
    if (!userData) return;

    const cargarPagina = async () => {
      let cursor = null;

      console.log("hola")
      if (pagina > 0) {
        cursor = historial[pagina - 1] || null;
      }
 console.log(        userData.uid,
        cursor,
        busqueda,
        pageSize,
        ordenCampo,
        ordenDireccion)
      const { productos: nuevos, lastVisible } = await getProductosByEmpresaPagina(
        userData.uid,
        cursor,
        "",
        pageSize,
        ordenCampo,
        ordenDireccion
      );
 console.log("hola3")
      // Filtrar productos por estado
      let filtrados = nuevos;
      if (filtroEstado !== "todos") {
        filtrados = nuevos.filter(
          (p) => calcularEstadoProducto(p.vencimiento) === filtroEstado
        );
      }

      setProductos(filtrados);

      setHistorial((prev) => {
        const copia = [...prev];
        copia[pagina] = lastVisible;
        return copia;
      });

      setSinMas(nuevos.length < pageSize);
    };

    cargarPagina();
  }, [pagina, userData, busqueda, filtroEstado, pageSize, ordenCampo, ordenDireccion]);

  return (
    <>
      <div className="row mb-3 g-3">
        <div className="col-md-4">
          <label className="form-label">Filtrar por estado</label>
          <select
            className="form-select"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="disponible">Disponibles</option>
            <option value="por vencer">Por vencer ({"<="}3 días)</option>
            <option value="vencido">Vencidos</option>
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Ordenar por</label>
          <select
            className="form-select"
            value={ordenCampo}
            onChange={(e) => setOrdenCampo(e.target.value)}
          >
            <option value="nombre">Nombre</option>
            <option value="precio">Precio</option>
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label">Dirección</label>
          <select
            className="form-select"
            value={ordenDireccion}
            onChange={(e) => setOrdenDireccion(e.target.value)}
          >
            <option value="asc">Ascendente</option>
            <option value="desc">Descendente</option>
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label">Productos por página</label>
          <select
            className="form-select"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {PAGE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <ul className="list-group mb-3">
            {productos.length === 0 && (
              <li className="list-group-item text-center text-muted">
                No se encontraron productos.
              </li>
            )}
            {productos.map((p) => {
              const estado = calcularEstadoProducto(p.vencimiento);
              return (
                <li
                  key={p.id}
                  className={`list-group-item d-flex justify-content-between align-items-center ${
                    estado === "vencido"
                      ? "list-group-item-danger"
                      : estado === "por vencer"
                      ? "list-group-item-warning"
                      : ""
                  }`}
                >
                  <div>
                    <strong>{p.nombre}</strong>{" "}
                    {p.precio === 0 && <span className="badge bg-success ms-2">Gratis</span>}
                    <br />
                    <small>{p.descripcion}</small>
                    <br />
                    <small>
                      Vence:{" "}
                      <span
                        className={
                          estado === "vencido"
                            ? "text-danger"
                            : estado === "por vencer"
                            ? "text-warning"
                            : ""
                        }
                      >
                        {p.vencimiento || "Sin fecha"}
                      </span>
                    </small>
                  </div>
                  <div className="text-end">
                    <div className="mb-2">${p.precio.toFixed(2)}</div>
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
              );
            })}
          </ul>
        </div>

        <div className="col">
          <p>Total de productos: {total}</p>
        </div>

        <div className="col-auto">
          <nav>
            <ul className="pagination">
              <li className={`page-item ${pagina < 1 ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPagina((p) => p - 1)}
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
              </li>
              <li className={`page-item ${sinMas ? "disabled" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPagina((p) => p + 1)}
                >
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
