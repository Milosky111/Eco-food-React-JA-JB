import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getAdministradores,
  registrarAdminConAuth,
  updateAdministrador,
  deleteAdministrador,
} from "../../../services/adminfirebase";

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

<<<<<<< HEAD
  const validarEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validarFormulario = () => {
    const { nombre, email, password } = formData;

    if (!nombre || nombre.trim().length < 3) {
      Swal.fire("Error", "El nombre debe tener al menos 3 caracteres.", "error");
      return false;
=======
  const guardar = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const errores = [];

  const nombreTrim = formData.nombre.trim();
  const emailTrim = formData.email.trim().toLowerCase();
  const passwordTrim = formData.password.trim();

  // Validación del nombre
  if (!nombreTrim) {
    errores.push("El nombre es obligatorio.");
  } else if (nombreTrim.length < 3 || nombreTrim.length > 50) {
    errores.push("El nombre debe tener entre 3 y 50 caracteres.");
  }

  // Validación del email
  if (!emailTrim) {
    errores.push("El email es obligatorio.");
  } else if (!emailRegex.test(emailTrim)) {
    errores.push("El email no tiene un formato válido.");
  }

  // Validación de la contraseña (solo para nuevos administradores)
  if (!adminActivo) {
    if (!passwordTrim) {
      errores.push("La contraseña es obligatoria para nuevo administrador.");
    } else if (passwordTrim.length < 6) {
      errores.push("La contraseña debe tener al menos 6 caracteres.");
>>>>>>> ca143e034b527e8074b145b044f7a877b68f2481
    }
    if (nombre.trim().length > 50) {
      Swal.fire("Error", "El nombre no debe superar 50 caracteres.", "error");
      return false;
    }

    if (!email || !validarEmail(email)) {
      Swal.fire("Error", "Por favor ingresa un email válido.", "error");
      return false;
    }
    if (email.length > 100) {
      Swal.fire("Error", "El email no debe superar 100 caracteres.", "error");
      return false;
    }

    if (!adminActivo) {
      // Validar password para nuevo admin
      if (!password) {
        Swal.fire("Error", "La contraseña es obligatoria para nuevo administrador.", "error");
        return false;
      }
      if (password.length < 6) {
        Swal.fire("Error", "La contraseña debe tener al menos 6 caracteres.", "error");
        return false;
      }
      if (password.length > 100) {
        Swal.fire("Error", "La contraseña no debe superar 100 caracteres.", "error");
        return false;
      }
    }

    return true;
  };

  const guardar = async () => {
    if (!validarFormulario()) return;

<<<<<<< HEAD
    try {
      if (adminActivo) {
        // Solo el admin con id "Root" puede ser principal
        const updatedData = adminActivo.id === "Root"
          ? { ...formData, esPrincipal: true }
          : { ...formData, esPrincipal: false };
        await updateAdministrador(adminActivo.id, updatedData);
        Swal.fire("Éxito", "Administrador actualizado.", "success");
      } else {
        await registrarAdminConAuth({ ...formData, esPrincipal: false });
        Swal.fire("Éxito", "Administrador creado.", "success");
      }
      setShowModal(false);
      cargarAdmins();
    } catch (error) {
      Swal.fire("Error", "Hubo un problema guardando el administrador.", "error");
      console.error(error);
=======
    // Validación de email duplicado
    const emailExiste = admins.some(
      (admin) => admin.email.toLowerCase() === emailTrim
    );
    if (emailExiste) {
      errores.push("El email ya está registrado por otro administrador.");
>>>>>>> ca143e034b527e8074b145b044f7a877b68f2481
    }
  }

  if (errores.length > 0) {
    return Swal.fire("Errores de validación", errores.join("\n"), "error");
  }

  try {
    if (adminActivo) {
      await updateAdministrador(adminActivo.id, { ...formData, email: emailTrim, nombre: nombreTrim });
      Swal.fire("Éxito", "Administrador actualizado.", "success");
    } else {
      await registrarAdminConAuth({ ...formData, email: emailTrim, nombre: nombreTrim, password: passwordTrim });
      Swal.fire("Éxito", "Administrador creado.", "success");
    }

    setShowModal(false);
    setAdminActivo(null);
    setFormData({ nombre: "", email: "", password: "", esPrincipal: false });
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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
  return Swal.fire("Error", "El email ingresado no es válido.", "error");
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
              <td style={{ fontWeight: a.esPrincipal ? "bold" : "normal", color: a.esPrincipal ? "#007bff" : "inherit" }}>
                {a.esPrincipal ? "Sí" : "No"}
              </td>
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
                  maxLength={50}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  maxLength={100}
                  type="email"
                />
                {!adminActivo && (
                  <input
                    type="password"
                    className="form-control mb-2"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    minLength={6}
                    maxLength={100}
                  />
                )}
                {/* Checkbox eliminado para evitar modificar esPrincipal */}
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