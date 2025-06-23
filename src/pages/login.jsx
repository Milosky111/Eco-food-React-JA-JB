import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  signOut,
} from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Persistencia local para mantener sesión aunque cierre navegador
      await setPersistence(auth, browserLocalPersistence);

      // Intentar iniciar sesión
      const cred = await signInWithEmailAndPassword(auth, email, password);

      // Refrescar usuario para asegurar info actualizada
      await cred.user.reload();

      // Verificar si el correo está confirmado
      if (!cred.user.emailVerified) {
        await signOut(auth);
        return Swal.fire(
          "Verificación pendiente",
          "Por favor, verifica tu correo antes de iniciar sesión.",
          "warning"
        );
      }

      Swal.fire("Bienvenido", "Has iniciado sesión correctamente", "success");
      navigate("/home");
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      Swal.fire(
        "Error",
        error.message.includes("user-not-found")
          ? "Usuario no encontrado."
          : error.message.includes("wrong-password")
          ? "Contraseña incorrecta."
          : "Credenciales incorrectas o fallo de red.",
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
      <p className="mt-3 text-center">
        ¿Olvidaste tu contraseña?{" "}
        <Link to="/RecuperarContraseña" style={{ textDecoration: "underline" }}>
          Restablecer aquí
        </Link>
      </p>
    </div>
  );
}