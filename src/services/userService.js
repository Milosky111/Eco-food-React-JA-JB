import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Obtiene los datos del usuario desde Firestore por UID
 * @param {string} uid - ID del usuario (auth.uid)
 * @returns {object} datos del usuario
 */
export const getUserData = async (uid) => {
  try {
    const ref = doc(db, "usuarios", uid);
    const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      return snapshot.data();
    } else {
      throw new Error("Usuario no encontrado en Firestore");
    }
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    throw error;
  }
};

/**
 * Guarda los datos del usuario al momento de registrarse
 * @param {string} uid
 * @param {object} data - {nombre, tipo, email}
 */
export const saveUserData = async (uid, data) => {
  try {
    await setDoc(doc(db, "usuarios", uid), data);
  } catch (error) {
    console.error("Error al guardar usuario:", error);
    throw error;
  }
};

/**
 * Busca los datos de un usuario por email en las colecciones
 * administradores, empresas y usuarios.
 * @param {string} email
 * @returns {object|null} datos del usuario y su tipo
 */
export const getUserDataByEmail = async (email) => {
  const colecciones = ["administradores", "empresas", "usuarios"];

  for (const col of colecciones) {
    const q = query(collection(db, col), where("email", "==", email.toLowerCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docSnap = querySnapshot.docs[0];
      return {
        id: docSnap.id,
        ...docSnap.data(),
        tipo: col === "usuarios" ? "cliente" : col, // Define tipo para login
      };
    }
  }
  return null;
};
