import { useEffect, useState } from "react";
import { auth } from "../../services/firebase";
import { getEmpresaDataPorUid } from "../../services/empresaService";
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

        const datosEmpresa = await getEmpresaDataPorUid(usuario.uid);

        if (!datosEmpresa) {
          Swal.fire("Acceso denegado", "No tienes permiso para acceder a este panel.", "error");
          return navigate("/");
        }

        setUserData(datosEmpresa);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        Swal.fire("Error", "No se pudieron cargar los datos del usuario", "error");
      }
    };

    cargarDatos();
  }, [navigate]);

  if (!userData) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh", background: "linear-gradient(135deg, #667eea, #764ba2)" }}
      >
        <div className="spinner-border text-light" role="status" aria-label="Loading" />
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center py-5"
      style={{
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        color: "#fff",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      }}
    >
      <div style={{ maxWidth: 960, width: "100%" }}>
        <div className="mb-5 text-center">
          <h1 className="fw-bold display-4">Hola, {userData.nombre || "Empresa"}</h1>
          <p className="fs-4">
            Bienvenido al panel de control de tu empresa. Aquí puedes administrar tus productos,
            pedidos y perfil.
          </p>
        </div>

        <div className="row g-5">
          {/* Tarjeta Perfil */}
          <div className="col-md-4">
            <div
              className="card h-100 shadow"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                border: "none",
                color: "#fff",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <i className="bi bi-person-circle fs-1 mb-3"></i>
                <h5 className="card-title">Perfil de Empresa</h5>
                <p className="card-text text-center" style={{ fontSize: "0.9rem" }}>
                  Correo: <br />
                  <span style={{ color: "#a8d0ff", fontFamily: "monospace" }}>
                    {auth.currentUser.email}
                  </span>
                  <br />
                  {userData.ubicacion && <>Ubicación: {userData.ubicacion}</>}
                </p>
                <Link to="/empresa/perfil" className="btn btn-outline-light mt-auto w-75" role="button">
                  Editar Perfil
                </Link>
              </div>
            </div>
          </div>

          {/* Tarjeta Productos */}
          <div className="col-md-4">
            <div
              className="card h-100 shadow"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                border: "none",
                color: "#fff",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <i className="bi bi-box-seam fs-1 mb-3"></i>
                <h5 className="card-title">Productos</h5>
                <p className="card-text text-center">
                  Administra tus productos: crea, edita, elimina y controla su estado.
                </p>
                <Link to="/empresa/productos" className="btn btn-outline-light mt-auto w-75">
                  Gestionar Productos
                </Link>
              </div>
            </div>
          </div>

          {/* Tarjeta Pedidos */}
          <div className="col-md-4">
            <div
              className="card h-100 shadow"
              style={{
                background: "rgba(255, 255, 255, 0.15)",
                backdropFilter: "blur(10px)",
                border: "none",
                color: "#fff",
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <div className="card-body d-flex flex-column justify-content-center align-items-center">
                <i className="bi bi-receipt fs-1 mb-3"></i>
                <h5 className="card-title">Pedidos y Cotizaciones</h5>
                <p className="card-text text-center">
                  Revisa y administra tus pedidos y cotizaciones pendientes.
                </p>
                <Link to="/empresa/pedidos" className="btn btn-outline-light mt-auto w-75" role="button">
                  Ver Pedidos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

