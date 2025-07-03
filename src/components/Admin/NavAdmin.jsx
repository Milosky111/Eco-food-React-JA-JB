import { NavLink } from "react-router-dom";

export default function NavAdmin() {
  return (
    <nav
      style={{
        width: "220px",
        padding: "1rem",
        borderRight: "1px solid #ddd",
        backgroundColor: "#f8f9fa",
        height: "100vh",
        boxSizing: "border-box",
      }}
    >
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li style={{ marginBottom: "1rem" }}>
          <NavLink
            to="/admin"
            end
            style={({ isActive }) => ({
              fontWeight: isActive ? "bold" : "normal",
              color: isActive ? "#0d6efd" : "#333",
              textDecoration: "none",
            })}
          >
            Dashboard
          </NavLink>
        </li>
        <li style={{ marginBottom: "1rem" }}>
          <NavLink
            to="/admin/empresas"
            style={({ isActive }) => ({
              fontWeight: isActive ? "bold" : "normal",
              color: isActive ? "#0d6efd" : "#333",
              textDecoration: "none",
            })}
          >
            Empresas
          </NavLink>
        </li>
        <li style={{ marginBottom: "1rem" }}>
          <NavLink
            to="/admin/clientes"
            style={({ isActive }) => ({
              fontWeight: isActive ? "bold" : "normal",
              color: isActive ? "#0d6efd" : "#333",
              textDecoration: "none",
            })}
          >
            Clientes
          </NavLink>
        </li>
        <li style={{ marginBottom: "1rem" }}>
          <NavLink
            to="/admin/administradores"
            style={({ isActive }) => ({
              fontWeight: isActive ? "bold" : "normal",
              color: isActive ? "#0d6efd" : "#333",
              textDecoration: "none",
            })}
          >
            Administradores
          </NavLink>
        </li>
        <li style={{ marginTop: "2rem" }}>
          <NavLink
            to="/logout"
            style={{
              color: "#dc3545",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Cerrar sesión
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}