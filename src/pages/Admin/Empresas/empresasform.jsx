import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../services/firebase";

function validarRut(rut) {
  const rutLimpio = rut.replace(/[^0-9kK]/g, "").toUpperCase();
  if (rutLimpio.length < 8 || rutLimpio.length > 9) return false;
  const cuerpo = rutLimpio.slice(0, -1);
  let dv = rutLimpio.slice(-1);

  let suma = 0, multiplo = 2;
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  let dvEsperado = 11 - (suma % 11);
  dvEsperado = dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();
  return dv === dvEsperado;
}

export default function EmpresaForm({ empresaEdit, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nombre: "", rut: "", direccion: "", comuna: "",
    email: "", telefono: "", password: ""
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormData({
      nombre: empresaEdit?.nombre || "",
      rut: empresaEdit?.rut || "",
      direccion: empresaEdit?.direccion || "",
      comuna: empresaEdit?.comuna || "",
      email: empresaEdit?.email || "",
      telefono: empresaEdit?.telefono || "",
      password: ""
    });
    setErrors({});
  }, [empresaEdit]);

  const checkRutYEmailDuplicados = async () => {
    const empresasRef = collection(db, "empresas");

    const [rutQuery, emailQuery] = await Promise.all([
      getDocs(query(empresasRef, where("rut", "==", formData.rut))),
      getDocs(query(empresasRef, where("email", "==", formData.email)))
    ]);

    const rutExiste = rutQuery.docs.some(doc => !empresaEdit || doc.id !== empresaEdit.id);
    const emailExiste = emailQuery.docs.some(doc => !empresaEdit || doc.id !== empresaEdit.id);

    return { rutExiste, emailExiste };
  };

  const validar = async () => {
    const e = {};
    const correoValido = /^\S+@\S+\.\S+$/;
    const telefonoValido = /^[0-9+\-() ]{8,15}$/;

    if (!formData.nombre.trim() || formData.nombre.length < 3 || formData.nombre.length > 100) {
      e.nombre = "Debe tener entre 3 y 100 caracteres.";
    }
    if (!formData.rut.trim() || !validarRut(formData.rut)) {
      e.rut = "RUT inválido (ej: 12345678-9).";
    }
    if (!correoValido.test(formData.email) || formData.email.length > 100) {
      e.email = "Correo inválido o muy largo.";
    }
    if (formData.telefono && !telefonoValido.test(formData.telefono)) {
      e.telefono = "Teléfono inválido (entre 8 y 15 caracteres).";
    }
    if (!empresaEdit) {
      if (!formData.password || formData.password.length < 6 || formData.password.length > 20) {
        e.password = "Contraseña de 6 a 20 caracteres obligatoria.";
      }
    }

    if (!empresaEdit) {
      const { rutExiste, emailExiste } = await checkRutYEmailDuplicados();
      if (rutExiste) e.rut = "Este RUT ya está registrado.";
      if (emailExiste) e.email = "Este correo ya está registrado.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleRutKeyDown = (e) => {
    const validKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "-", "k", "K"];
    if (!validKeys.includes(e.key) && !/[0-9]/.test(e.key)) e.preventDefault();
  };

  const handleTelefonoKeyDown = (e) => {
    const validKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "+", "-", "(", ")", " "];
    if (!validKeys.includes(e.key) && !/[0-9]/.test(e.key)) e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const esValido = await validar();
    setSubmitting(false);

    if (!esValido) {
      Swal.fire("Errores", "Revisa los campos marcados en rojo.", "warning");
      return;
    }

    try {
      const datos = { ...formData };
      if (empresaEdit && !formData.password) delete datos.password;

      await onSave(datos);
      Swal.fire("Éxito", empresaEdit ? "Empresa actualizada" : "Empresa creada", "success");
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo guardar la empresa", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {[
        { name: "nombre", label: "Nombre", required: true, max: 100 },
        { name: "rut", label: "RUT", required: true, max: 12, onKeyDown: handleRutKeyDown },
        { name: "direccion", label: "Dirección", required: false, max: 200 },
        { name: "comuna", label: "Comuna", required: false, max: 50 },
        { name: "email", label: "Email", type: "email", required: true, max: 100 },
        { name: "telefono", label: "Teléfono", type: "tel", required: false, max: 15, onKeyDown: handleTelefonoKeyDown }
      ].map(({ name, label, type = "text", required, max, onKeyDown }) => (
        <div className="mb-3" key={name}>
          <label className="form-label">{label}</label>
          <input
            type={type}
            name={name}
            className={`form-control ${errors[name] ? "is-invalid" : ""}`}
            value={formData[name]}
            onChange={handleChange}
            placeholder={label}
            maxLength={max}
            required={required}
            onKeyDown={onKeyDown}
          />
          {errors[name] && <div className="invalid-feedback">{errors[name]}</div>}
        </div>
      ))}

      {!empresaEdit && (
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            name="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            maxLength={20}
            placeholder="********"
            required
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>
      )}

      <div className="d-flex justify-content-end">
        <button type="button" className="btn btn-secondary me-2" onClick={onClose} disabled={submitting}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Guardando..." : empresaEdit ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
}
