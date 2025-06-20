import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import CerrarSesion from "../components/CerrarSesion";
function Home() {
return (
<div>
<h2>Bienvenido a EcoFood</h2>
<CerrarSesion />
</div>
);
}

export default function CerrarSesion()
{
const navigate = useNavigate();
const handleLogout = async () => {
try {
await signOut(auth);
Swal.fire("Sesión cerrada", "Has cerrado sesión correctamente", "success");
navigate("/login");
// eslint-disable-next-line no-unused-vars
} catch (error) {
Swal.fire("Error", "No se pudo cerrar la sesión", "error");
}
};
return (
<button onClick={handleLogout} className="btn btn-danger">
Cerrar Sesión
</button>
);
}
