import { useState, useEffect } from "react";
import Swal from "sweetalert2";
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
      Swal.fire("Error", "Error al cargar empresas: " + error.message, "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    const empresa = empresas.find((e) => e.id === id);
    if (!empresa) return;

    const result = await Swal.fire({
      title: `¿Eliminar empresa "${empresa.nombre}"?`,
      text: "Esta acción es irreversible.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        await eliminarEmpresa(id);
        if (empresaSeleccionada?.id === id) setEmpresaSeleccionada(null);
        await cargarEmpresas();
        Swal.fire("Eliminada", "Empresa eliminada correctamente.", "success");
      } catch (error) {
        Swal.fire("Error", "Error eliminando empresa: " + error.message, "error");
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
      await cargarEmpresas();
      setShowForm(false);
      Swal.fire("Éxito", "Empresa guardada correctamente.", "success");
    } catch (error) {
      Swal.fire("Error", "Error guardando empresa: " + error.message, "error");
      console.error(error);
    }
  };

  if (loading)
    return (
      <div className="text-center my-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Empresas</h2>
      <button
        className="btn btn-primary mb-3"
        onClick={abrirFormularioCrear}
        disabled={loading}
      >
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
                      disabled={loading}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleEliminar(empresa.id)}
                      disabled={loading}
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
