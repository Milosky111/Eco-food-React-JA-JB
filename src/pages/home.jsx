import CardProducto from '../components/primerproducto';
import { getUserData } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import CerrarSesion from "../components/CerrarSesion";

function Home() {
  return (
    <div className="container mt-4" style={{ maxWidth: "900px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Bienvenido a EcoFood</h2>
        <CerrarSesion />
      </div>

      <h3 className="mb-3">Productos Disponibles</h3>

      <div className="row">
        <div className="col-md-4 mb-3">
          <CardProducto nombre="Pan Integral" precio="$500" />
        </div>
        {/* Puedes agregar más productos aquí */}
      </div>
    </div>
  );
}

export default Home;