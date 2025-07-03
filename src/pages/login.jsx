import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  signOut,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { getUserData } from "../services/userService";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await setPersistence(auth, browserLocalPersistence);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      await cred.user.reload(); // asegura obtener emailVerified actualizado

      if (!cred.user.emailVerified) {
        await signOut(auth);
        return Swal.fire(
          "Verificación pendiente",
          "Por favor, verifica tu correo antes de iniciar sesión.",
          "warning"
        );
      }

      const datos = await getUserData(cred.user.uid);
      console.log("Datos del usuario:", datos);

      if (!datos || !datos.tipo) {
        return Swal.fire("Error", "No se encontraron datos del usuario.", "error");
      }

      Swal.fire("Bienvenido", "Has iniciado sesión correctamente", "success");

      if (datos.tipo === "admin") navigate("/admin/dashboard");
      else if (datos.tipo === "cliente") navigate("/cliente/dashboard");
      else navigate("/home"); // fallback en caso de tipo desconocido

    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);

      Swal.fire(
        "Error",
        error.message.includes("user-not-found")
          ? "Usuario no encontrado."
          : error.message.includes("wrong-password")
          ? "Contraseña incorrecta."
          : error.message || "Credenciales incorrectas o fallo de red.",
        "error"
      );
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Correo Electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="tu@correo.com"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="********"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Iniciar Sesión
        </button>
      </form>
      <Link to="/registro" className="btn btn-secondary w-100 mt-2">
        Registrarse
      </Link>
      <p className="mt-3 text-center">
        ¿Olvidaste tu contraseña?{" "}
        <Link to="/RecuperarContraseña" style={{ textDecoration: "underline" }}>
          Restablecer aquí
        </Link>
      </p>
    </div>
  );
}