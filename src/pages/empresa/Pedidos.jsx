export default function Pedidos() {
  return (
    <div
      className="container mt-5 p-4 rounded"
      style={{
        maxWidth: "900px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        boxShadow: "0 0 15px rgba(118, 75, 162, 0.7)",
      }}
    >
      <div className="card bg-light text-dark shadow-sm">
        <div className="card-body">
          <h2 className="card-title mb-3 text-center" style={{ color: "#764ba2" }}>
            📦 Pedidos y Cotizaciones Pendientes
          </h2>
          <p className="lead text-center" style={{ color: "#555" }}>
            👋 ¡Hola! Esta sección estará disponible pronto para que puedas revisar y administrar tus pedidos y cotizaciones.
          </p>

          <div className="table-responsive mt-4">
            <table className="table table-striped table-hover align-middle shadow-sm rounded">
              <thead
                style={{ backgroundColor: "#764ba2", color: "#fff" }}
              >
                <tr>
                  <th>ID</th>
                  <th>Tipo</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                  <th>Total</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="7" className="text-center fst-italic py-5" style={{ color: "#999" }}>
                    No hay pedidos ni cotizaciones pendientes por el momento.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


