import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import { getUserData } from "../../services/userService";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function EmpresaDashboard() {
  const [userData, setUserData] = useState(null);
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
      } catch (error) {
        console.error("Error al cargar datos:", error);
        Swal.fire("Error", "No se pudieron cargar los datos del usuario", "error");
      }
    };

    cargarDatos();
  }, [navigate]);

  if (!userData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="bg-light p-4 rounded shadow-sm">
        <div className="d-flex align-items-center mb-4">
          <i className="bi bi-building display-5 text-primary me-3"></i>
          <div>
            <h2 className="mb-1">Panel de Empresa</h2>
            <p className="mb-0 text-muted">Gestión centralizada de tu cuenta</p>
          </div>
        </div>

        <div className="mb-3">
          <h5>Bienvenido, <strong>{userData.nombre || "Empresa"}</strong></h5>
          <p>Correo: <code>{auth.currentUser.email}</code></p>
          {userData.ubicacion && <p>Ubicación: <strong>{userData.ubicacion}</strong></p>}
        </div>

        <div className="mb-4">
          <h4 className="mb-3">Opciones disponibles</h4>
          <ul className="list-group">
            <li className="list-group-item">
              <Link to="/empresa/productos" className="text-decoration-none">
                📦 Ver y administrar productos
              </Link>
            </li>
            <li className="list-group-item">
              <Link to="/empresa/pedidos" className="text-decoration-none text-muted">
                📋 Revisar pedidos o cotizaciones
              </Link>
            </li>
            <li className="list-group-item">
              <Link to="/empresa/perfil" className="text-decoration-none text-muted">
                ⚙️ Editar perfil de empresa
              </Link>
            </li>
          </ul>
        </div>

        <div className="d-grid">
          <Link to="/empresa/productos" className="btn btn-primary">
            Ir a Productos
          </Link>
        </div>
      </div>
    </div>
  );
}
