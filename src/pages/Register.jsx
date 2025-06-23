import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../services/firebase";
import { saveUserData } from "../services/userService";
import Swal from "sweetalert2";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [direccion, setDireccion] = useState("");
  const [comuna, setComuna] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipo] = useState("cliente"); // Fijo como "cliente"

  const navigate = useNavigate();

  const isPasswordRobusta = (pass) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pass);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!isPasswordRobusta(password)) {
      return Swal.fire(
        "Contraseña débil",
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.",
        "warning"
      );
    }

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(cred.user);

      await saveUserData(cred.user.uid, {
        nombre,
        email,
        direccion,
        comuna,
        telefono: telefono || null,
        tipo,
      });

      Swal.fire(
        "¡Registro exitoso!",
        "Te enviamos un correo de verificación. Revisa tu bandeja de entrada.",
        "success"
      );

      navigate("/login");
    } catch (error) {
      console.error("Error al registrar:", error);
      Swal.fire("Error", "No se pudo registrar", "error");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <label className="form-label">Nombre completo</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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
            placeholder="Mínimo 8 caracteres, mayúscula, número y símbolo"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Dirección</label>
          <input
            type="text"
            className="form-control"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Comuna</label>
          <input
            type="text"
            className="form-control"
            value={comuna}
            onChange={(e) => setComuna(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Teléfono (opcional)</label>
          <input
            type="tel"
            className="form-control"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="+56 9 1234 5678"
          />
        </div>

        <button type="submit" className="btn btn-success">Registrar</button>
      </form>
    </div>
  );
}