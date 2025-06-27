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
    await setPersistence(auth, browserLocalPersistence);
    const cred = await signInWithEmailAndPassword(auth, email, password);
    if (!cred.user.emailVerified) {
    Swal.fire("Verificación requerida", "Debes verificar tu correo antes de ingresar.", "warning");
    return;
    }
    const datos = await getUserData(cred.user.uid);
    if (datos.tipo === "admin") navigate("/admin/dashboard");
    else if (datos.tipo === "cliente") navigate("/cliente/dashboard");
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
    Swal.fire("Error", "Credenciales incorrectas", "error");
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

const handleLogin = async (e) => {
  e.preventDefault();
  try {
  await setPersistence(auth, browserLocalPersistence);
  const cred = await signInWithEmailAndPassword(auth, email, password);
  if (!cred.user.emailVerified) {
  Swal.fire("Verificación requerida", "Debes verificar tu correo antes de ingresar.", "warning");
  return;
  }
  const datos = await getUserData(cred.user.uid);
  if (datos.tipo === "admin") navigate("/admin/dashboard");
  else if (datos.tipo === "cliente") navigate("/cliente/dashboard");
  // eslint-disable-next-line no-unused-vars
  } catch (error) {
  Swal.fire("Error", "Credenciales incorrectas", "error");
  }
  };