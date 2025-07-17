import { addProducto, updateProducto } from "../../services/productoService";
import Swal from "sweetalert2";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";

const estados = [
  { value: "disponible", label: "Disponible" },
  { value: "por vencer", label: "Por vencer" },
  { value: "vencido", label: "Vencido" },
];

export default function ModalProductos({
  show,
  setShow,
  userData,
  handleRefresh,
  formData,
  setFormData,
}) {
  const [error, setError] = useState("");

  useEffect(() => {
    setError("");
  }, [formData]);

  const validarFormulario = () => {
    if (!formData.nombre.trim()) {
      setError("El nombre es obligatorio");
      return false;
    }

    if (formData.precio < 0) {
      setError("El precio no puede ser negativo");
      return false;
    }

    if (formData.cantidad < 0) {
      setError("La cantidad no puede ser negativa");
      return false;
    }

    if (formData.vencimiento) {
      const hoy = new Date();
      const fechaVenc = new Date(formData.vencimiento);
      hoy.setHours(0, 0, 0, 0);
      if (fechaVenc < hoy) {
        setError("La fecha de vencimiento no puede ser anterior a hoy");
        return false;
      }
    }

    if (!formData.estado) {
      setError("El estado es obligatorio");
      return false;
    }

    setError("");
    return true;
  };

  const guardarProducto = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      Swal.fire("Error", error, "error");
      return;
    }

    try {
      if (formData.id) {
        await updateProducto(formData.id, formData);
        Swal.fire("Actualizado correctamente", "", "success");
      } else {
        await addProducto({ ...formData, empresaId: userData.uid });
        Swal.fire("Agregado correctamente", "", "success");
      }
      handleRefresh();
      setShow(false);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "No se pudo guardar el producto", "error");
    }
  };

  // Helpers para botones +/-
  const cambiarCantidad = (delta) => {
    const nuevaCantidad = (formData.cantidad ?? 0) + delta;
    if (nuevaCantidad >= 0) {
      setFormData({ ...formData, cantidad: nuevaCantidad });
    }
  };

  const cambiarPrecio = (delta) => {
    const nuevoPrecio = (formData.precio ?? 0) + delta;
    if (nuevoPrecio >= 0) {
      setFormData({ ...formData, precio: nuevoPrecio });
    }
  };

  // Validar input manual
  const manejarCambioCantidad = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setFormData({ ...formData, cantidad: val === "" ? 0 : parseInt(val) });
    }
  };

  const manejarCambioPrecio = (e) => {
    const val = e.target.value;
    // Permitir solo números enteros para precio (puedes modificar para decimales)
    if (/^\d*$/.test(val)) {
      setFormData({ ...formData, precio: val === "" ? 0 : parseInt(val) });
    }
  };

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>{formData.id ? "Editar" : "Agregar"} Producto</Modal.Title>
      </Modal.Header>
      <form onSubmit={guardarProducto}>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="nombre" className="form-label">
              Nombre *
            </label>
            <input
              id="nombre"
              className="form-control"
              placeholder="Nombre del producto"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="descripcion" className="form-label">
              Descripción
            </label>
            <textarea
              id="descripcion"
              className="form-control"
              placeholder="Descripción del producto"
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Cantidad *</label>
            <div className="input-group">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => cambiarCantidad(-1)}
              >
                -
              </button>
              <input
                type="text"
                className="form-control text-center"
                value={formData.cantidad ?? 0}
                onChange={manejarCambioCantidad}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => cambiarCantidad(1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Precio (0 = gratuito) *</label>
            <div className="input-group">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => cambiarPrecio(-100)}
              >
                -
              </button>
              <input
                type="text"
                className="form-control text-center"
                value={formData.precio ?? 0}
                onChange={manejarCambioPrecio}
                required
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => cambiarPrecio(100)}
              >
                +
              </button>
            </div>
            {formData.precio === 0 && (
              <small className="text-success">Producto gratuito</small>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="vencimiento" className="form-label">
              Fecha de Vencimiento
            </label>
            <input
              id="vencimiento"
              type="date"
              className="form-control"
              value={formData.vencimiento || ""}
              onChange={(e) =>
                setFormData({ ...formData, vencimiento: e.target.value })
              }
            />
            {formData.vencimiento && (() => {
              const hoy = new Date();
              const venc = new Date(formData.vencimiento);
              const diffTime = venc - hoy.setHours(0, 0, 0, 0);
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              if (diffDays <= 3 && diffDays >= 0) {
                return (
                  <small className="text-warning">
                    ⚠️ Producto vence en {diffDays} día
                    {diffDays > 1 ? "s" : ""}
                  </small>
                );
              }
              if (diffDays < 0) {
                return <small className="text-danger">❌ Producto vencido</small>;
              }
              return null;
            })()}
          </div>

          <div className="mb-3">
            <label htmlFor="estado" className="form-label">
              Estado *
            </label>
            <select
              id="estado"
              className="form-select"
              value={formData.estado || "disponible"}
              onChange={(e) =>
                setFormData({ ...formData, estado: e.target.value })
              }
              required
            >
              {estados.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShow(false)}
          >
            Cerrar
          </button>
          <button type="submit" className="btn btn-success">
            Guardar
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
