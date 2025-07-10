import { db, secondaryAuth } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

const adminsCollection = collection(db, "administradores");

// Obtener todos los administradores
export const getAdministradores = async () => {
  const q = query(adminsCollection);
  const querySnapshot = await getDocs(q);
  const admins = [];
  querySnapshot.forEach((docSnap) => {
    admins.push({ id: docSnap.id, ...docSnap.data() });
  });
  return admins;
};

// Registrar administrador nuevo (Auth + Firestore)
export const registrarAdminConAuth = async (datos) => {
  try {
    const cred = await createUserWithEmailAndPassword(
      secondaryAuth,
      datos.email,
      datos.password
    );
    await sendEmailVerification(cred.user);

    // Guardar datos en Firestore con ID generado por Auth UID
    await addDoc(adminsCollection, {
      nombre: datos.nombre,
      email: datos.email,
      tipo: "admin",
      esPrincipal: datos.esPrincipal || false,
      id: cred.user.uid,
    });

    await secondaryAuth.signOut();

    return cred;
  } catch (error) {
    console.error("Error registrando administrador:", error);
    throw error;
  }
};

// Actualizar datos de administrador
export const updateAdministrador = async (id, datos) => {
  const adminRef = doc(db, "administradores", id);

  const datosActualizar = {
    nombre: datos.nombre,
    email: datos.email,
    esPrincipal: datos.esPrincipal || false,
  };

  // No hay lógica para actualizar contraseña aquí, ya que requiere reautenticación y manejo aparte

  await updateDoc(adminRef, datosActualizar);
};

// Eliminar administrador
export const deleteAdministrador = async (id) => {
  const adminRef = doc(db, "administradores", id);
  await deleteDoc(adminRef);
};
