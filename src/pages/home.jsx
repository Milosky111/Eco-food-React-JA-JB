import CardProducto from '../components/primerproducto';
import { getUserData } from "../services/userService";
import { useAuth } from "../context/AuthContext";
import CerrarSesion from "../components/CerrarSesion"; 
 

function Home() {
  return (
    <>
      <h2>Bienvenido a EcoFood</h2>
      <CerrarSesion />
      <h1>Productos Disponibles</h1>
      <CardProducto nombre="Pan Integral" precio="$500" />
    </>
  );
}
export default Home
