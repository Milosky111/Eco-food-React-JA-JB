import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAt,
  endAt,
  startAfter,
  getCountFromServer,
} from "firebase/firestore";

export const PAGE_SIZES = [5, 10, 20];

export const addProducto = async (producto) => {
  const ref = doc(collection(db, "productos"));
  const productoConId = { ...producto, id: ref.id };
  await setDoc(ref, productoConId);
};

export const eliminarProducto = async (id) =>
  await deleteDoc(doc(db, "productos", id));

export const updateProducto = async (id, data) => {
  const ref = doc(db, "productos", id);
  await updateDoc(ref, data);
};

/**
 * Obtener total productos con filtros opcionales
 * @param {string} empresaId
 * @param {string} busqueda
 * @param {string} estado - 'todos' | 'disponible' | 'por vencer' | 'vencido'
 */
export async function obtenerTotalProductos(empresaId, busqueda = "", estado = "todos") {
  const productosRef = collection(db, "productos");
  let constraints = [where("empresaId", "==", empresaId)];

  if (estado !== "todos") {
    constraints.push(where("estado", "==", estado));
  }

  if (busqueda.trim() !== "") {
    const term = busqueda.toLowerCase();
    constraints.push(orderBy("nombre"), startAt(term), endAt(term + "\uf8ff"));
  }

  const q = query(productosRef, ...constraints);
  const snapshot = await getCountFromServer(q);
  return snapshot.data().count;
}

/**
 * Obtener productos paginados con filtros y orden
 * @param {string} empresaId
 * @param {any} cursor - documento cursor para paginación
 * @param {string} busqueda
 * @param {string} estado
 * @param {string} ordenCampo - campo para ordenar ('nombre' o 'precio')
 * @param {string} ordenDireccion - 'asc' o 'desc'
 * @param {number} pageSize - cantidad de productos por página
 */
export const getProductosByEmpresaPagina = async (
  empresaId,
  cursor = null,
  busqueda = "",
  estado = "todos",
  ordenCampo = "nombre",
  ordenDireccion = "asc",
  pageSize = PAGE_SIZES[0]
) => {
  const ref = collection(db, "productos");
  let constraints = [where("empresaId", "==", empresaId)];

  if (estado !== "todos") {
    constraints.push(where("estado", "==", estado));
  }

  const tieneBusqueda = busqueda.trim() !== "";
  const term = busqueda.toLowerCase();

  if (tieneBusqueda) {
    // Solo se puede ordenar por "nombre" si se usa búsqueda
    constraints.push(orderBy("nombre"), startAt(term), endAt(term + "\uf8ff"));
  } else {
    constraints.push(orderBy(ordenCampo, ordenDireccion));
  }

  if (cursor) {
    constraints.push(startAfter(cursor));
  }

  constraints.push(limit(pageSize));

  const q = query(ref, ...constraints);
  const snapshot = await getDocs(q);
  const productos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  const lastVisible = snapshot.docs[snapshot.docs.length - 1];

  return { productos, lastVisible };
};

