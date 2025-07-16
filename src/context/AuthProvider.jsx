// src/context/AuthProvider.jsx
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { AuthContext } from "./AuthContext";
import { getUserData } from "../services/userService";

export const AuthProvider = ({ children }) => {
<<<<<<< HEAD
  const [user, setUser] = useState(null); // Firebase Auth
  const [userData, setUserData] = useState(null); // Firestore: nombre, tipo, etc.
  const [loading, setLoading] = useState(true); // Estado de carga
=======
<<<<<<< Crud-Productos
  const [user, setUser] = useState(null); // Firebase Auth
  const [userData, setUserData] = useState(null); // Firestore: nombre, tipo, etc.
  const [loading, setLoading] = useState(true); // Carga completa
>>>>>>> cb539dd4343851c0b39d6c5f5b283f01ffbf1435

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const data = await getUserData(firebaseUser.uid);
<<<<<<< HEAD
          data.uid = firebaseUser.uid; // Añadir UID manualmente
=======
          data.uid = firebaseUser.uid; // Se agregó esta línea
>>>>>>> cb539dd4343851c0b39d6c5f5b283f01ffbf1435
          setUserData(data);
        } catch (error) {
          console.error("Error cargando datos de Firestore:", error);
          setUserData(null);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
<<<<<<< HEAD
=======
=======
const [user, setUser] = useState(null); // Firebase Auth
const [userData, setUserData] = useState(null); // Firestore: nombre, tipo, etc.
const [loading, setLoading] = useState(true); // Carga completa
useEffect(() => {
const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
if (firebaseUser) {
setUser(firebaseUser);
try {
const data = await getUserData(firebaseUser.uid);
data.uid = firebaseUser.uid; //añadido por la guia
setUserData(data);
} catch (error) {
console.error("Error cargando datos de Firestore:", error);
setUserData(null);
}
} else {
setUser(null);
setUserData(null);
}
setLoading(false);
});
return () => unsubscribe();
}, []);
return (
<AuthContext.Provider value={{ user, userData, loading }}>
{children}
</AuthContext.Provider>
);
};
>>>>>>> main
>>>>>>> cb539dd4343851c0b39d6c5f5b283f01ffbf1435
