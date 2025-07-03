import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../services/firebase";

const empresasRef = collection(db, "empresas");

// Obtener todas las empresas
export const getEmpresas = async () => {
  const snapshot = await getDocs(empresasRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Crear empresa
export const addEmpresa = async (data) => {
  const docRef = await addDoc(empresasRef, data);
  return docRef.id;
};

// Actualizar empresa
export const updateEmpresa = async (id, data) => {
  const empresaDoc = doc(db, "empresas", id);
  await updateDoc(empresaDoc, data);
};

// Eliminar empresa
export const eliminarEmpresa = async (id) => {
  const empresaDoc = doc(db, "empresas", id);
  await deleteDoc(empresaDoc);
};