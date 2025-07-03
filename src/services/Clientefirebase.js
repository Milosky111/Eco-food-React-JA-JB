import { db, secondaryAuth } from "./firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import {
  collection, query, where, getDocs, addDoc,
  updateDoc, deleteDoc, setDoc, doc
} from "firebase/firestore";

const usuariosCollection = collection(db, "usuarios");

// Registrar cliente con autenticación Firebase + Firestore
export const registrarClienteConAuth = async (datos) => {
  try {
    const cred = await createUserWithEmailAndPassword(secondaryAuth, datos.email, datos.password);
    await sendEmailVerification(cred.user);
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      nombre: datos.nombre || "",
      comuna: datos.comuna || "",
      direccion: datos.direccion || "",
      tipo: "cliente",
      email: datos.email || ""
    });
    await secondaryAuth.signOut();
    return cred;
  } catch (error) {
    console.error("Error registrando cliente:", error);
    throw error;
  }
};

// Obtener clientes (usuarios tipo cliente)
export const getClientes = async () => {
  const q = query(usuariosCollection, where("tipo", "==", "cliente"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Actualizar cliente
export const updateCliente = async (id, clienteData) => {
  const docRef = doc(db, "usuarios", id);
  await updateDoc(docRef, clienteData);
};

// Eliminar cliente
export const deleteCliente = async (id) => {
  const docRef = doc(db, "usuarios", id);
  await deleteDoc(docRef);
};