import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import RecuperarContraseña from "../pages/RecuperarContraseña";
import ProtectedByRole from "./ProtectedByRole";
//CLiente
import ClienteDashboard from  "../pages/Cliente/ClienteDashboard" 
//Admin
import AdminLayout from  "../components/Admin/AdminLayout";
import AdminDashboard from "../pages/Admin/adminDashboard";
import AdminProductos from '../pages/Admin/adminProductos';

export default function AppRouter() {
 return (
 <Routes>
 <Route path="/login" element={<Login />} />
 <Route path="/" element={<Login />} />
 <Route path="/recuperar" element={<RecuperarContraseña />} />
 <Route path="/registro" element={<Register />} />
 <Route path="/home" element={
 <ProtectedRoute>
 <Home />
 </ProtectedRoute>
 } />
 <Route path="/cliente/dashboard" element={
 <ProtectedByRole allowed={["cliente"]}>
 <ClienteDashboard />
 </ProtectedByRole>
 } />
 <Route path="/admin" element={
 <ProtectedByRole allowed={["admin"]}>
 <AdminLayout />
 </ProtectedByRole>
 }>
 <Route path="dashboard" element={<AdminDashboard />} />
 <Route path="productos" element={<AdminProductos />} />
 </Route>
 </Routes>
 );
}
