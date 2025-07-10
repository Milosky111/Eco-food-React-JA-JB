import { db } from "./firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export const getUserData = async (uid) => {
  const ref = doc(db, "usuarios", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

export const updateUserData = async (uid, data) => {
  const ref = doc(db, "usuarios", uid);
  await updateDoc(ref, data);
};
