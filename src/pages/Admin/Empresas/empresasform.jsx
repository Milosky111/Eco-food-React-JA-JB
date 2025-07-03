import { useState, useEffect } from "react";
import Swal from "sweetalert2";

function validarRut(rut) {
  // Limpia rut y separa cuerpo y dígito verificador
  const rutLimpio = rut.replace(/[^0-9kK]/g, "").toUpperCase();
  if (rutLimpio.length < 8 || rutLimpio.length > 9) return false;
  const cuerpo = rutLimpio.slice(0, -1);
  let dv = rutLimpio.slice(-1);

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i), 10) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  let dvEsperado = 11 - (suma % 11);
  if (dvEsperado === 11) dvEsperado = "0";
  else if (dvEsperado === 10) dvEsperado = "K";
  else dvEsperado = dvEsperado.toString();

  return dv === dvEsperado;
}

export default function EmpresaForm({ empresaEdit, onClose, onSave }) {
  const [formData, setFormData] = useState({
    nombre: "",
    rut: "",
    direccion: "",
    comuna: "",
    email: "",
    telefono: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (empresaEdit) {
      setFormData({
        nombre: empresaEdit.nombre || "",
        rut: empresaEdit.rut || "",
        direccion: empresaEdit.direccion || "",
        comuna: empresaEdit.comuna || "",
        email: empresaEdit.email || "",
        telefono: empresaEdit.telefono || "",
        password: ""
      });
      setErrors({});
    } else {
      setFormData({
        nombre: "",
        rut: "",
        direccion: "",
        comuna: "",
        email: "",
        telefono: "",
        password: ""
      });
      setErrors({});
    }
  }, [empresaEdit]);

  const validar = () => {
    const errs = {};

    if (!formData.nombre.trim() || formData.nombre.trim().length < 3 || formData.nombre.trim().length > 100) {
      errs.nombre = "El nombre es obligatorio y debe tener entre 3 y 100 caracteres.";
    }

    if (!formData.rut.trim() || !validarRut(formData.rut.trim())) {
      errs.rut = "El RUT es obligatorio y debe ser válido (incluyendo dígito verificador).";
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email.trim()) || formData.email.trim().length > 100) {
      errs.email = "El email es obligatorio, debe ser válido y tener máximo 100 caracteres.";
    }

    if (formData.telefono) {
      if (formData.telefono.length < 8 || formData.telefono.length > 15) {
        errs.telefono = "El teléfono debe tener entre 8 y 15 caracteres si se ingresa.";
      }
    }

    if (!empresaEdit) {
      if (!formData.password) {
        errs.password = "La contraseña es obligatoria para nueva empresa.";
      } else if (formData.password.length < 6 || formData.password.length > 20) {
        errs.password = "La contraseña debe tener entre 6 y 20 caracteres.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(old => ({ ...old, [name]: value }));
    setErrors(oldErrors => ({ ...oldErrors, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validar()) {
      return;
    }

    setSubmitting(true);

    try {
      // No enviar password vacío (solo si es edición)
      const dataToSend = { ...formData };
      if (empresaEdit && !dataToSend.password) delete dataToSend.password;

      await onSave(dataToSend);

      Swal.fire({
        icon: "success",
        title: empresaEdit ? "Empresa actualizada" : "Empresa creada",
        timer: 1500,
        showConfirmButton: false,
      });
      onClose();
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Hubo un problema guardando la empresa.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mb-3">
        <label className="form-label">Nombre</label>
        <input
          type="text"
          name="nombre"
          className={"form-control " + (errors.nombre ? "is-invalid" : "")}
          value={formData.nombre}
          onChange={handleChange}
          minLength={3}
          maxLength={100}
          placeholder="Nombre de la empresa"
          required
        />
        {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">RUT</label>
        <input
          type="text"
          name="rut"
          className={"form-control " + (errors.rut ? "is-invalid" : "")}
          value={formData.rut}
          onChange={handleChange}
          minLength={8}
          maxLength={12}
          placeholder="12345678-9"
          required
        />
        {errors.rut && <div className="invalid-feedback">{errors.rut}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Dirección</label>
        <input
          type="text"
          name="direccion"
          className="form-control"
          value={formData.direccion}
          onChange={handleChange}
          maxLength={200}
          placeholder="Dirección (opcional)"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Comuna</label>
        <input
          type="text"
          name="comuna"
          className="form-control"
          value={formData.comuna}
          onChange={handleChange}
          maxLength={50}
          placeholder="Comuna (opcional)"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          className={"form-control " + (errors.email ? "is-invalid" : "")}
          value={formData.email}
          onChange={handleChange}
          maxLength={100}
          placeholder="correo@empresa.cl"
          required
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
      </div>

      <div className="mb-3">
        <label className="form-label">Teléfono</label>
        <input
          type="tel"
          name="telefono"
          className={"form-control " + (errors.telefono ? "is-invalid" : "")}
          value={formData.telefono}
          onChange={handleChange}
          minLength={8}
          maxLength={15}
          placeholder="Teléfono (opcional)"
        />
        {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
      </div>

      {!empresaEdit && (
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            name="password"
            className={"form-control " + (errors.password ? "is-invalid" : "")}
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
        <button
          type="button"
          className="btn btn-secondary me-2"
          onClick={onClose}
          disabled={submitting}
        >
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Guardando..." : empresaEdit ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
}