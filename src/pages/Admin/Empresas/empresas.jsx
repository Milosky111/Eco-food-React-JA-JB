import { useState, useEffect } from "react";
import { getEmpresas, addEmpresa, updateEmpresa, eliminarEmpresa } from "../../../services/Empresafirebase";
import EmpresaForm from "./empresasform";
import ProductosPorEmpresa from "../../../components/Productosempresa";

export default function Empresas() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [empresaEdit, setEmpresaEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);

  useEffect(() => {
    cargarEmpresas();
  }, []);

  const cargarEmpresas = async () => {
    try {
      setLoading(true);
      const data = await getEmpresas();
      setEmpresas(data);
    } catch (error) {
      alert("Error al cargar empresas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm("¿Está seguro de eliminar esta empresa?")) {
      try {
        await eliminarEmpresa(id);
        if (empresaSeleccionada?.id === id) setEmpresaSeleccionada(null);
        cargarEmpresas();
      } catch (error) {
        alert("Error eliminando la empresa");
        console.error(error);
      }
    }
  };

  const abrirFormularioCrear = () => {
    setEmpresaEdit(null);
    setShowForm(true);
  };

  const abrirFormularioEditar = (empresa) => {
    setEmpresaEdit(empresa);
    setShowForm(true);
  };

  const cerrarFormulario = () => {
    setShowForm(false);
  };

  const guardar = async (data) => {
    try {
      if (empresaEdit) {
        await updateEmpresa(empresaEdit.id, data);
      } else {
        await addEmpresa(data);
      }
      cargarEmpresas();
      setShowForm(false);
    } catch (error) {
      alert("Error guardando empresa");
      console.error(error);
    }
  };

  if (loading) return <div className="text-center my-4"><div className="spinner-border" role="status"><span className="visually-hidden">Cargando...</span></div></div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Empresas</h2>
      <button className="btn btn-primary mb-3" onClick={abrirFormularioCrear}>
        Crear Nueva Empresa
      </button>

      {showForm && (
        <div className="mb-4">
          <EmpresaForm
            empresaEdit={empresaEdit}
            onClose={cerrarFormulario}
            onSave={guardar}
          />
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Rut</th>
              <th>Dirección</th>
              <th>Comuna</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Acciones</th>
              <th>Productos</th>
            </tr>
          </thead>
          <tbody>
            {empresas.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">
                  No hay empresas registradas
                </td>
              </tr>
            ) : (
              empresas.map((empresa) => (
                <tr key={empresa.id}>
                  <td>{empresa.nombre}</td>
                  <td>{empresa.rut}</td>
                  <td>{empresa.direccion}</td>
                  <td>{empresa.comuna}</td>
                  <td>{empresa.email}</td>
                  <td>{empresa.telefono}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => abrirFormularioEditar(empresa)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleEliminar(empresa.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-info"
                      onClick={() => setEmpresaSeleccionada(empresa)}
                    >
                      Ver Productos
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {empresaSeleccionada && (
        <div className="mt-4 p-3 border rounded bg-light">
          <h3>Productos de {empresaSeleccionada.nombre}</h3>
          <ProductosPorEmpresa empresaId={empresaSeleccionada.id} />
          <button
            className="btn btn-secondary mt-3"
            onClick={() => setEmpresaSeleccionada(null)}
          >
            Cerrar productos
          </button>
        </div>
      )}
    </div>
  );
}
