import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import { getUserData, updateUserData } from "../../services/empresaService"; // crear updateUserData
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function PerfilEmpresa() {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    ubicacion: "",
    correo: "",
    rut: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const usuario = auth.currentUser;
        if (!usuario) {
          Swal.fire("Error", "No hay usuario autenticado", "error");
          return navigate("/login");
        }
        const datos = await getUserData(usuario.uid);
        if (!datos || datos.tipo !== "empresa") {
          Swal.fire("Acceso denegado", "No tienes permiso para acceder a este panel.", "error");
          return navigate("/");
        }
        setUserData(datos);
        setFormData({
          nombre: datos.nombre || "",
          ubicacion: datos.ubicacion || "",
          correo: usuario.email || "",
          rut: datos.rut || "",
        });
      } catch (error) {
        console.error(error);
        Swal.fire("Error", "No se pudieron cargar los datos", "error");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((old) => ({ ...old, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre.trim()) {
      return Swal.fire("Error", "El nombre es obligatorio.", "warning");
    }

    setSaving(true);
    try {
      await updateUserData(auth.currentUser.uid, {
        nombre: formData.nombre.trim(),
        ubicacion: formData.ubicacion.trim(),
      });
      Swal.fire("Guardado", "Perfil actualizado correctamente.", "success");
      setUserData((old) => ({
        ...old,
        nombre: formData.nombre.trim(),
        ubicacion: formData.ubicacion.trim(),
      }));
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo actualizar el perfil.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "70vh" }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      {/* Botón para volver atrás */}
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate(-1)}
        type="button"
      >
        ← Volver
      </button>

      <h2>Perfil de Empresa</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">
            Nombre
          </label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            className="form-control"
            value={formData.nombre}
            onChange={handleChange}
            disabled={saving}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="ubicacion" className="form-label">
            Ubicación
          </label>
          <input
            id="ubicacion"
            name="ubicacion"
            type="text"
            className="form-control"
            value={formData.ubicacion}
            onChange={handleChange}
            disabled={saving}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input className="form-control" value={formData.correo} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label">RUT</label>
          <input className="form-control" value={formData.rut} disabled />
        </div>

        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </form>
    </div>
  );
}
