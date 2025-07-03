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
  const [tipo] = useState("cliente");

  const navigate = useNavigate();

  const isPasswordRobusta = (pass) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pass);
  };

  const isTelefonoValido = (tel) => {
    return /^[0-9]{9,15}$/.test(tel);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (nombre.length < 3 || nombre.length > 50) {
      return Swal.fire("Nombre inválido", "El nombre debe tener entre 3 y 50 caracteres.", "warning");
    }

    if (email.length < 5 || email.length > 100) {
      return Swal.fire("Correo inválido", "El correo debe tener entre 5 y 100 caracteres.", "warning");
    }

    if (direccion.length < 5 || direccion.length > 70) {
      return Swal.fire("Dirección inválida", "La dirección debe tener entre 5 y 70 caracteres.", "warning");
    }

    if (comuna.length < 3 || comuna.length > 50) {
      return Swal.fire("Comuna inválida", "La comuna debe tener entre 3 y 50 caracteres.", "warning");
    }

    if (telefono && !isTelefonoValido(telefono)) {
      return Swal.fire("Teléfono inválido", "Debe contener solo números (9 a 15 dígitos).", "warning");
    }

    if (!isPasswordRobusta(password)) {
      return Swal.fire(
        "Contraseña débil",
        "Debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.",
        "warning"
      );
    }

    try {
      console.log("Intentando crear usuario...");
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Usuario creado:", cred.user.uid);

      await sendEmailVerification(cred.user);
      console.log("Correo de verificación enviado.");

      await saveUserData(cred.user.uid, {
        nombre,
        email,
        direccion,
        comuna,
        telefono: telefono || null,
        tipo,
      });
      console.log("Datos del usuario guardados.");

      Swal.fire(
        "¡Registro exitoso!",
        "Te enviamos un correo de verificación. Revisa tu bandeja de entrada.",
        "success"
      );

      navigate("/login");
    } catch (error) {
      console.error("Error al registrar:", error);
      Swal.fire("Error", error.message || "No se pudo registrar", "error");
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
            minLength={3}
            maxLength={50}
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
            minLength={5}
            maxLength={100}
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
            minLength={8}
            maxLength={50}
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
            minLength={5}
            maxLength={70} // corregido para que coincida con la validación
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
            minLength={3}
            maxLength={50}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Teléfono (opcional)</label>
          <input
            type="tel"
            className="form-control"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ""))}
            placeholder="Ej: 912345678"
            maxLength={15}
          />
        </div>

        <button type="submit" className="btn btn-success">Registrar</button>
      </form>
    </div>
  );
}