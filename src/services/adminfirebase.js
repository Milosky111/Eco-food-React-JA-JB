import { db, secondaryAuth } from "./firebase";
import {
  collection,
  query,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword,
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

    // Guardar datos en Firestore usando UID como ID
    await setDoc(doc(db, "administradores", cred.user.uid), {
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

// Actualizar datos de administrador en Firestore y Authentication (email y opcional contraseña)
export const updateAdministrador = async (id, datos) => {
  // Actualizar Firestore
  const adminRef = doc(db, "administradores", id);
  await updateDoc(adminRef, {
    nombre: datos.nombre,
    email: datos.email,
    esPrincipal: datos.esPrincipal || false,
  });

  // Actualizar email y contraseña en Auth si vienen en datos
  if (datos.email || datos.password) {
    try {
      // Iniciar sesión temporalmente con secondaryAuth para poder actualizar
      // Este paso asume que tienes la contraseña actual para reautenticación
      // O que el secondaryAuth está configurado para esto

      // Si quieres actualizar email:
      if (datos.email) {
        const user = secondaryAuth.currentUser;
        if (!user || user.uid !== id) {
          // Reautenticar o iniciar sesión con admin para actualizar
          // Aquí debes proveer cómo obtener la sesión con secondaryAuth
          throw new Error("No autenticado para actualizar email");
        }
        await firebaseUpdateEmail(user, datos.email);
      }

      // Si quieres actualizar contraseña:
      if (datos.password) {
        const user = secondaryAuth.currentUser;
        if (!user || user.uid !== id) {
          throw new Error("No autenticado para actualizar contraseña");
        }
        await firebaseUpdatePassword(user, datos.password);
      }
    } catch (error) {
      console.error("Error actualizando email o contraseña en Auth:", error);
      throw error;
    }
  }
};

// Eliminar administrador
export const deleteAdministrador = async (id) => {
  const adminRef = doc(db, "administradores", id);
  await deleteDoc(adminRef);
};
