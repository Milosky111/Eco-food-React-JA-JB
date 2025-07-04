import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  getClientes,
  updateCliente,
  deleteCliente,
  registrarClienteConAuth,
} from "../../../services/Clientefirebase";

export default function AdminClientes() {
  const [clientes, setClientes] = useState([]);
  const [clienteActivo, setClienteActivo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    comuna: "",
    password: "",
  });

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      Swal.fire("Error", "No se pudieron cargar los clientes.", "error");
      console.error(error);
    }
  };
<<<<<<< HEAD

  const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validarFormulario = () => {
    const errores = [];
    const { nombre, email, comuna, password } = formData;

    if (!nombre || nombre.trim().length < 3) errores.push("El nombre debe tener al menos 3 caracteres.");
    else if (nombre.trim().length > 50) errores.push("El nombre no debe superar 50 caracteres.");

    if (!email) errores.push("El email es obligatorio.");
    else if (!validarEmail(email)) errores.push("El email no es válido.");
    else if (email.length > 100) errores.push("El email no debe superar 100 caracteres.");

    if (!comuna || comuna.trim().length < 3) errores.push("La comuna debe tener al menos 3 caracteres.");
    else if (comuna.trim().length > 50) errores.push("La comuna no debe superar 50 caracteres.");

    if (!clienteActivo) {
      if (!password) errores.push("La contraseña es obligatoria para nuevo cliente.");
      else if (password.length < 6) errores.push("La contraseña debe tener al menos 6 caracteres.");
      else if (password.length > 100) errores.push("La contraseña no debe superar 100 caracteres.");
=======
//CODIGO ANTERIOR POR SI ACASO
 /* const guardar = async () => {
    if (!formData.nombre || !formData.email || !formData.comuna) {
      return Swal.fire("Error", "Todos los campos son obligatorios.", "error");
>>>>>>> ca143e034b527e8074b145b044f7a877b68f2481
    }

    if (errores.length > 0) {
      Swal.fire("Errores de validación", errores.join("\n"), "error");
      return false;
    }

    return true;
  };

  const guardar = async () => {
    if (!validarFormulario()) return;

    try {
      if (clienteActivo) {
        await updateCliente(clienteActivo.id, formData);
        Swal.fire("Éxito", "Cliente actualizado.", "success");
      } else {
        await registrarClienteConAuth(formData);
        Swal.fire("Éxito", "Cliente creado.", "success");
      }
      setShowModal(false);
      cargarClientes();
    } catch (error) {
      Swal.fire("Error", error.message || "Hubo un problema guardando el cliente.", "error");
      console.error(error);
    }
  };
*/
  const guardar = async () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const errores = [];

  // Validación del nombre
  if (!formData.nombre.trim()) {
    errores.push("El nombre es obligatorio.");
  } else if (formData.nombre.trim().length < 3) {
    errores.push("El nombre debe tener al menos 3 caracteres.");
  }

  // Validación del email
  if (!formData.email.trim()) {
    errores.push("El email es obligatorio.");
  } else if (!emailRegex.test(formData.email.trim())) {
    errores.push("El email no tiene un formato válido.");
  }

  // Validación de la comuna
  if (!formData.comuna.trim()) {
    errores.push("La comuna es obligatoria.");
  } else if (formData.comuna.trim().length < 3) {
    errores.push("La comuna debe tener al menos 3 caracteres.");
  }

  // Validación de la contraseña solo para nuevos clientes
  if (!clienteActivo) {
    if (!formData.password.trim()) {
      errores.push("La contraseña es obligatoria para nuevo cliente.");
    } else if (formData.password.trim().length < 6) {
      errores.push("La contraseña debe tener al menos 6 caracteres.");
    }
  }

  if (errores.length > 0) {
    return Swal.fire("Errores de validación", errores.join("\n"), "error");
  }

  try {
    if (clienteActivo) {
      await updateCliente(clienteActivo.id, formData);
      Swal.fire("Éxito", "Cliente actualizado.", "success");
    } else {
      await registrarClienteConAuth(formData);
      Swal.fire("Éxito", "Cliente creado.", "success");
    }

    setShowModal(false);
    setClienteActivo(null);
    setFormData({ nombre: "", email: "", comuna: "", password: "" });
    cargarClientes();
  } catch (error) {
    Swal.fire("Error", "Hubo un problema guardando el cliente.", "error");
    console.error(error);
  }
};



  const eliminar = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar cliente?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí",
    });

    if (result.isConfirmed) {
      try {
        await deleteCliente(id);
        cargarClientes();
        Swal.fire("Éxito", "Cliente eliminado.", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar el cliente.", "error");
        console.error(error);
      }
    }
  };

  const abrirModalNuevoCliente = () => {
    setClienteActivo(null);
    setFormData({ nombre: "", email: "", comuna: "", password: "" });
    setShowModal(true);
  };

  const abrirModalEditarCliente = (cliente) => {
    setClienteActivo(cliente);
    setFormData({ ...cliente, password: "" });
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <h3>Clientes Registrados</h3>
      <button className="btn btn-primary" onClick={abrirModalNuevoCliente}>
        Nuevo Cliente
      </button>

      <table className="table mt-3">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Comuna</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map((c) => (
            <tr key={c.id}>
              <td>{c.nombre}</td>
              <td>{c.email}</td>
              <td>{c.comuna}</td>
              <td>
                <button className="btn btn-warning btn-sm me-1" onClick={() => abrirModalEditarCliente(c)}>
                  Editar
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => eliminar(c.id)}>
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
                <h5 className="modal-title">
                  {clienteActivo ? "Editar Cliente" : "Nuevo Cliente"}
                </h5>
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
                  type="email"
                  className="form-control mb-2"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  maxLength={100}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Comuna"
                  value={formData.comuna}
                  onChange={(e) => setFormData({ ...formData, comuna: e.target.value })}
                  maxLength={50}
                />
                {!clienteActivo && (
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