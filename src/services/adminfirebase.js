import { db, secondaryAuth } from "./firebase"; // secondaryAuth para crear usuarios sin afectar sesión actual
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

const adminsCollection = collection(db, "usuarios"); // Asumiendo colección "usuarios" con tipo "admin"

// Obtener todos los administradores
export const getAdministradores = async () => {
  const q = query(adminsCollection, where("tipo", "==", "admin"));
  const querySnapshot = await getDocs(q);
  const admins = [];
  querySnapshot.forEach((doc) => {
    admins.push({ id: doc.id, ...doc.data() });
  });
  return admins;
};

// Registrar administrador nuevo (Auth + Firestore)
export const registrarAdminConAuth = async (datos) => {
  try {
    // Crear usuario en Auth (secondaryAuth para no afectar sesión actual)
    const cred = await createUserWithEmailAndPassword(
      secondaryAuth,
      datos.email,
      datos.password
    );
    await sendEmailVerification(cred.user);

    // Si se marca admin principal, desactivar en los demás admins
    if (datos.esPrincipal) {
      await desactivarAdminPrincipalExistente();
    }

    // Guardar datos en Firestore
    await setDoc(doc(db, "usuarios", cred.user.uid), {
      nombre: datos.nombre,
      email: datos.email,
      tipo: "admin",
      esPrincipal: datos.esPrincipal || false,
    });

    await secondaryAuth.signOut(); // cerrar sesión secundaria

    return cred;
  } catch (error) {
    console.error("Error registrando administrador:", error);
    throw error;
  }
};

// Actualizar datos de administrador
export const updateAdministrador = async (id, datos) => {
  const adminRef = doc(db, "usuarios", id);

  if (datos.esPrincipal) {
    await desactivarAdminPrincipalExistente(id); // Pasa id para ignorar el admin actual
  }

  // No actualizar password aquí, manejarlo aparte si quieres

  await updateDoc(adminRef, {
    nombre: datos.nombre,
    email: datos.email,
    esPrincipal: datos.esPrincipal || false,
  });
};

// Eliminar administrador
export const deleteAdministrador = async (id) => {
  const adminRef = doc(db, "usuarios", id);
  await deleteDoc(adminRef);
};

// Función para desactivar admin principal actual (excepto id opcional)
const desactivarAdminPrincipalExistente = async (exceptId = null) => {
  const q = query(
    adminsCollection,
    where("tipo", "==", "admin"),
    where("esPrincipal", "==", true)
  );
  const querySnapshot = await getDocs(q);

  const batchUpdates = [];
  querySnapshot.forEach((docSnap) => {
    if (docSnap.id !== exceptId) {
      batchUpdates.push(
        updateDoc(doc(db, "usuarios", docSnap.id), { esPrincipal: false })
      );
    }
  });

  await Promise.all(batchUpdates);
};