import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase";
import Swal from "sweetalert2";

export default function RecuperarContraseña() {
  const [email, setEmail] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire(
        "Correo enviado",
        "Revisa tu correo para restablecer la contraseña.",
        "success"
      );
      setEmail("");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2>Restablecer Contraseña</h2>
      <form onSubmit={handleReset}>
        <div className="mb-3">
          <label className="form-label">Correo Electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="tu@correo.com"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100 mb-3">
          Enviar correo de restablecimiento
        </button>
      </form>

      {/* Botón para volver al login */}
      <div className="text-center">
        <Link to="/login" className="btn btn-secondary">
          Volver al Login
        </Link>
      </div>
    </div>
  );
}