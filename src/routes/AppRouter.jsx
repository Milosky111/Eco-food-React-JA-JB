import { Routes, Route } from "react-router-dom";

// Páginas públicas
import Login from "../pages/Login";
import Register from "../pages/Register";
import RecuperarContraseña from "../pages/RecuperarContraseña";

// Cliente
import ClienteDashboard from "../pages/Cliente/ClienteDashboard";

// Admin
import AdminLayout from "../components/Admin/AdminLayout";
import AdminDashboard from "../pages/Admin/adminDashboard";
import AdminEmpresas from "../pages/Admin/Empresas/empresas";
import AdminClientes from "../pages/Admin/Clientes/AdminClientes";
import AdminAdministradores from "../pages/Admin/Administradores/administradores";

// Empresa
import EmpresaDashboard from "../pages/empresa/EmpresaDashboard";
import EmpresaProductos from "../pages/Empresa/Productos";
import EmpresaPerfil from "../pages/empresa/Empresaperfil";
import Pedidos from "../pages/empresa/Pedidos";

export default function AppRouter() {
  return (
    <Routes>
      {/* Páginas públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/recuperar" element={<RecuperarContraseña />} />

      {/* Cliente */}
      <Route path="/cliente/dashboard" element={<ClienteDashboard />} />

      {/* Admin con layout y rutas anidadas */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="empresas" element={<AdminEmpresas />} />
        <Route path="clientes" element={<AdminClientes />} />
        <Route path="administradores" element={<AdminAdministradores />} />
      </Route>

      {/* Empresa */}
      <Route path="/empresa/dashboard" element={<EmpresaDashboard />} />
      <Route path="/empresa/perfil" element={<EmpresaPerfil />} />
      <Route path="/empresa/productos" element={<EmpresaProductos />} />
      <Route path="/empresa/pedidos" element={<Pedidos />} /> 

      {/* Ruta fallback: si no coincide nada, redirige al login */}
      <Route path="*" element={<Login />} />
    </Routes>
  );
}