import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { db, auth } from "../services/firebase";
import { saveUserData } from "./userService";

const empresasRef = collection(db, "empresas");

// Obtener todas las empresas
export const getEmpresas = async () => {
  const snapshot = await getDocs(empresasRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Crear empresa con Auth + Firestore
export const crearEmpresaConAuth = async (data) => {
  try {
    // Crear usuario en Firebase Authentication
    const cred = await createUserWithEmailAndPassword(auth, data.email, data.password);

    // Enviar correo de verificación
    await sendEmailVerification(cred.user);

    // Preparar datos
    const { password, ...empresaData } = data;
    empresaData.uid = cred.user.uid;

    // Guardar en colección empresas
    await addDoc(empresasRef, empresaData);

    // Guardar en colección usuarios para control de roles
    await saveUserData(cred.user.uid, {
      email: data.email,
      tipo: "empresa",
      nombre: data.nombre,
    });

    return cred.user.uid;
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      throw new Error("El correo ya está registrado en otra cuenta.");
    }
    throw error;
  }
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
