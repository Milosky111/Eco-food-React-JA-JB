import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { AuthContext } from "./AuthContext"; // Asegúrate de tener este archivo 
separado
export const AuthProvider = ({ children }) => {
 const [user, setUser] = useState(null);
 const [loading, setLoading] = useState(true); // Espera a que Firebase confirme 
usuario
 useEffect(() => {
 const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
 setUser(currentUser);
 setLoading(false); // Termina cuando se confirma usuario (o null)
 });
 return () => unsubscribe(); // Limpieza al desmontar
 }, []);
 if (loading) {
 return <div>Cargando autenticación...</div>; // También puedes usar un 
spinner
 }
 return (
 <AuthContext.Provider value={{ user }}>
 {children}
 </AuthContext.Provider>
 );
};
