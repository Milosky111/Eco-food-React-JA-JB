import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getAdministradores,
  registrarAdminConAuth,
  updateAdministrador,
  deleteAdministrador,
} from "../../../services/AdminFirebase"; // Ajusta el path a tu servicio

export default function AdminAdministradores() {
  const [admins, setAdmins] = useState([]);
  const [adminActivo, setAdminActivo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ nombre: "", email: "", password: "", esPrincipal: false });

  const cargarAdmins = async () => {
    try {
      const data = await getAdministradores();
      setAdmins(data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los administradores.", "error");
      console.error(error);
    }
  };

  const guardar = async () => {
    if (!formData.nombre || !formData.email || (!adminActivo && !formData.password)) {
      return Swal.fire("Error", "Nombre, email y contraseña (solo nuevo) son obligatorios.", "error");
    }

    try {
      if (adminActivo) {
        await updateAdministrador(adminActivo.id, formData);
        Swal.fire("Éxito", "Administrador actualizado.", "success");
      } else {
        // Para registrar un admin nuevo
        await registrarAdminConAuth(formData);
        Swal.fire("Éxito", "Administrador creado.", "success");
      }
      setShowModal(false);
      cargarAdmins();
    } catch (error) {
      Swal.fire("Error", "Hubo un problema guardando el administrador.", "error");
      console.error(error);
    }
  };

  const eliminar = async (id) => {
    const admin = admins.find(a => a.id === id);

    if (admin?.esPrincipal) {
      return Swal.fire("Error", "No puedes eliminar al administrador principal.", "error");
    }

    const result = await Swal.fire({
      title: "¿Eliminar administrador?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
    });

    if (result.isConfirmed) {
      try {
        await deleteAdministrador(id);
        Swal.fire("Éxito", "Administrador eliminado.", "success");
        cargarAdmins();
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el administrador.", "error");
        console.error(error);
      }
    }
  };

  useEffect(() => {
    cargarAdmins();
  }, []);

  return (
    <div className="container mt-4">
      <h3>Administradores</h3>
      <button
        className="btn btn-primary"
        onClick={() => {
          setAdminActivo(null);
          setFormData({ nombre: "", email: "", password: "", esPrincipal: false });
          setShowModal(true);
        }}
      >
        Nuevo Administrador
      </button>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Admin Principal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((a) => (
            <tr key={a.id}>
              <td>{a.nombre}</td>
              <td>{a.email}</td>
              <td>{a.esPrincipal ? "Sí" : "No"}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => {
                    setAdminActivo(a);
                    setFormData({ ...a, password: "" });
                    setShowModal(true);
                  }}
                >
                  Editar
                </button>{" "}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminar(a.id)}
                  disabled={a.esPrincipal}
                  title={a.esPrincipal ? "No se puede eliminar al admin principal" : ""}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">

              <div className="modal-header">
                <h5 className="modal-title">{adminActivo ? "Editar Administrador" : "Nuevo Administrador"}</h5>
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {!adminActivo && (
                  <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                )}
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="esPrincipal"
                    checked={formData.esPrincipal}
                    onChange={(e) => setFormData({ ...formData, esPrincipal: e.target.checked })}
                    disabled={adminActivo?.esPrincipal}
                  />
                  <label className="form-check-label" htmlFor="esPrincipal">
                    Admin Principal
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button className="btn btn-success" onClick={guardar}>
                  Guardar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}