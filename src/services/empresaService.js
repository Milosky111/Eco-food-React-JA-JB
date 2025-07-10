import { db } from "./firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";

export const getEmpresaDataPorUid = async (uid) => {
  const empresasRef = collection(db, "empresas");
  const q = query(empresasRef, where("uid", "==", uid));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
  }
  return null;
};

export const updateEmpresaDataPorId = async (id, data) => {
  const empresaRef = doc(db, "empresas", id);
  await updateDoc(empresaRef, data);
};
