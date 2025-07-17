import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import { getEmpresaDataPorUid, updateEmpresaDataPorId } from "../../services/empresaService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function PerfilEmpresa() {
  const [empresaData, setEmpresaData] = useState(null);
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

        const datos = await getEmpresaDataPorUid(usuario.uid);
        if (!datos) {
          Swal.fire("Acceso denegado", "No tienes permiso para acceder a este panel.", "error");
          return navigate("/");
        }

        setEmpresaData(datos);
        setFormData({
          nombre: datos.nombre || "",
          ubicacion: datos.ubicacion || datos.comuna || "",
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

    const nombre = formData.nombre.trim();
    const ubicacion = formData.ubicacion.trim();

    // Validaciones
    if (!nombre || nombre.length < 3) {
      return Swal.fire("Error", "El nombre debe tener al menos 3 caracteres.", "warning");
    }

    if (nombre.length > 50) {
      return Swal.fire("Error", "El nombre no puede tener más de 50 caracteres.", "warning");
    }

    if (!ubicacion) {
      return Swal.fire("Error", "La ubicación es obligatoria.", "warning");
    }

    if (ubicacion.length > 50) {
      return Swal.fire("Error", "La ubicación no puede tener más de 50 caracteres.", "warning");
    }

    setSaving(true);
    try {
      await updateEmpresaDataPorId(empresaData.id, {
        nombre,
        ubicacion,
      });

      Swal.fire("Guardado", "Perfil actualizado correctamente.", "success");

      setEmpresaData((old) => ({
        ...old,
        nombre,
        ubicacion,
      }));

      setTimeout(() => navigate(-1), 1500);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "No se pudo actualizar el perfil.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh", background: "linear-gradient(135deg, #667eea, #764ba2)" }}
      >
        <div className="spinner-border text-light" role="status" />
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center p-3"
      style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
    >
      <div
        className="card shadow"
        style={{
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(10px)",
          borderRadius: "12px",
          maxWidth: 600,
          width: "100%",
          color: "#fff",
          padding: "1.5rem",
        }}
      >
        <h3 className="card-title mb-4 text-center">Perfil de Empresa</h3>
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
              minLength={3}
              maxLength={50}
              style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "#fff", border: "none" }}
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
              required
              maxLength={50}
              style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "#fff", border: "none" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              className="form-control"
              value={formData.correo}
              disabled
              style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "#ddd", border: "none" }}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">RUT</label>
            <input
              className="form-control"
              value={formData.rut}
              disabled
              style={{ backgroundColor: "rgba(255,255,255,0.1)", color: "#ddd", border: "none" }}
            />
          </div>

          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
              Volver
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
