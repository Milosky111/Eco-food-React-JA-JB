import CardProducto from '../components/primerproducto';
function Home() {
 return (
 <div className="container mt-4">
 <h1>Productos Disponibles</h1>
 <CardProducto nombre="Pan Integral" precio="$500" />
 </div>
 );
}
export default Home