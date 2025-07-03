import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../services/firebase";

const productosRef = collection(db, "productos");

// Obtener todos los productos
export const getProductos = async () => {
  const snapshot = await getDocs(productosRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Obtener productos por empresa
export const getProductosPorEmpresa = async (empresaId) => {
  const q = query(productosRef, where("empresaId", "==", empresaId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Agregar producto nuevo
export const addProducto = async (data) => {
  const docRef = await addDoc(productosRef, data);
  return docRef.id;
};

// Actualizar producto existente
export const updateProducto = async (id, data) => {
  const productoDoc = doc(db, "productos", id);
  await updateDoc(productoDoc, data);
};

// Eliminar producto
export const eliminarProducto = async (id) => {
  const productoDoc = doc(db, "productos", id);
  await deleteDoc(productoDoc);
};