import { useState, useEffect } from "react";
import { getEmpresas, addEmpresa, updateEmpresa, eliminarEmpresa } from "../../../services/Empresafirebase";
import EmpresaForm from "./empresasform";
import ProductosPorEmpresa from "../../../components/Productosempresa";

export default function Empresas() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [empresaEdit, setEmpresaEdit] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null); // NUEVO

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
        // Si borras la empresa seleccionada, la deseleccionas
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

  if (loading) return <p>Cargando empresas...</p>;

  return (
    <div>
      <h2>Empresas</h2>
      <button onClick={abrirFormularioCrear}>Crear Nueva Empresa</button>

      {showForm && (
        <EmpresaForm
          empresaEdit={empresaEdit}
          onClose={cerrarFormulario}
          onSave={guardar}
        />
      )}

      <table border="1" cellPadding="5" cellSpacing="0" style={{ marginTop: "1em", width: "100%" }}>
        <thead>
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
              <td colSpan="8" style={{ textAlign: "center" }}>No hay empresas registradas</td>
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
                  <button onClick={() => abrirFormularioEditar(empresa)}>Editar</button>{" "}
                  <button onClick={() => handleEliminar(empresa.id)}>Eliminar</button>
                </td>
                <td>
                  <button onClick={() => setEmpresaSeleccionada(empresa)}>
                    Ver Productos
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {empresaSeleccionada && (
        <div style={{ marginTop: 20 }}>
          <h2>Productos de {empresaSeleccionada.nombre}</h2>
          <ProductosPorEmpresa empresaId={empresaSeleccionada.id} />
          <button onClick={() => setEmpresaSeleccionada(null)}>Cerrar productos</button>
        </div>
      )}
    </div>
  );
}
