import { Routes, Route } from "react-router-dom";
import Login from "../pages/login";
import Register from "../pages/Register";
import Home from "../pages/home";
import ProtectedRoute from "./ProtectedRoute";
import RecuperarContraseña from "../pages/RecuperarContraseña";
export default function AppRouter() {
return (
<Routes>
<Route path="/login" element={<Login />} />
<Route path="/" element={<Login />} />
<Route path="/registro" element={<Register />} />
<Route path="/RecuperarContraseña" element={<RecuperarContraseña />} />
<Route path="/home" element={
<ProtectedRoute>
<Home />
</ProtectedRoute>
} />
</Routes>
);
}