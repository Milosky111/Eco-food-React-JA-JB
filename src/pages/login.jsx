import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  signOut,
} from "firebase/auth";
import { auth } from "../services/firebase";
import { getUserDataByEmail } from "../services/userService"; // <-- Importa la función nueva
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
      await cred.user.reload();

      if (!cred.user.emailVerified) {
        await signOut(auth);
        return Swal.fire(
          "Verificación pendiente",
          "Por favor, verifica tu correo antes de iniciar sesión.",
          "warning"
        );
      }

      // Buscar datos en Firestore POR EMAIL, no por UID
      const datos = await getUserDataByEmail(email);
      console.log("Datos del usuario:", datos);

      if (!datos || !datos.tipo) {
        return Swal.fire("Error", "No se encontraron datos del usuario.", "error");
      }

      Swal.fire("Bienvenido", "Has iniciado sesión correctamente", "success");

      switch (datos.tipo) {
        case "administradores":
          navigate("/admin/dashboard");
          break;
        case "empresas":
          navigate("/empresa/dashboard");
          break;
        case "cliente":
          navigate("/cliente/dashboard");
          break;
        default:
          Swal.fire("Error", "Rol de usuario no reconocido.", "error");
          await signOut(auth);
          break;
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      let mensaje = "Ocurrió un error inesperado.";

      switch (error.code) {
        case "auth/invalid-email":
          mensaje = "El correo electrónico no es válido.";
          break;
        case "auth/user-not-found":
          mensaje = "No existe una cuenta con este correo.";
          break;
        case "auth/wrong-password":
          mensaje = "La contraseña es incorrecta.";
          break;
        case "auth/user-disabled":
          mensaje = "Esta cuenta ha sido deshabilitada.";
          break;
        case "auth/too-many-requests":
          mensaje = "Demasiados intentos fallidos. Intenta más tarde.";
          break;
        case "auth/network-request-failed":
          mensaje = "Fallo de red. Verifica tu conexión a internet.";
          break;
        default:
          mensaje = error.message || mensaje;
          break;
      }

      Swal.fire("Error al iniciar sesión", mensaje, "error");
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
        <Link to="/recuperar" style={{ textDecoration: "underline" }}>
          Restablecer aquí
        </Link>
      </p>
    </div>
  );
}
