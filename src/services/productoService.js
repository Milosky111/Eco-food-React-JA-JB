import { db } from "./firebase";
import { collection,
setDoc,
getDocs,
updateDoc,
query,
where,
deleteDoc,
doc,
orderBy,
limit,
startAt,
endAt,
startAfter,
getCountFromServer, // SDK v9+ → consulta agregada COUNT
} from "firebase/firestore";
export const addProducto = async (producto) => {
const ref = doc(collection(db, "productos")); // genera ID
const productoConId = { ...producto, id: ref.id };
await setDoc(ref, productoConId);
};
export const deleteProducto = async (id) => await deleteDoc(doc(db, "productos", id));
export const updateProducto = async (id, data) => {
const ref = doc(db, "productos", id);
await updateDoc(ref, data);
};
export async function obtenerTotalProductos(empresaId, busqueda = "") {
// 1. Referencia a la colección
const productosRef = collection(db, "productos");
// 2. Construir la query base (filtra por empresa)
let q = query(productosRef, where("empresaId", "==", empresaId));
// 3. Si hay término de búsqueda, aplicar rango "empieza con"
if (busqueda.trim() !== "") {
const term = busqueda.toLowerCase();
q = query(
q,
orderBy("nombre"), // ya necesitas un índice compuesto
startAt(term),
endAt(term + "\uf8ff")
);
}
// 4. Consulta agregada COUNT (solo metadata, NO lee todos los docs)
const snapshot = await getCountFromServer(q);
return snapshot.data().count; // número entero
}
export const PAGE_SIZE = 5;
export const getProductosByEmpresaPagina = async (empresaId, cursor = null, nombre =
"") => {
let ref = collection(db, "productos");
let q = query(ref,
where("empresaId", "==", empresaId),
orderBy("nombre"),
startAt(nombre),
endAt(nombre + "\uf8ff"),
limit(PAGE_SIZE)
);
if (cursor) {
q = query(ref,
where("empresaId", "==", empresaId),
orderBy("nombre"),
startAt(nombre),
endAt(nombre + "\uf8ff"),
startAfter(cursor),
limit(PAGE_SIZE));
}
const snapshot = await getDocs(q);
const productos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
const lastVisible = snapshot.docs[snapshot.docs.length - 1];
return { productos, lastVisible };
};