import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

export const useDoc = async (collectionName: string, docName: string) => {
  try {
    const docRef = doc(db, collectionName, docName);
    const docSnapshot = await getDoc(docRef);
    return docSnapshot.data();
  } catch (error) {
    console.error(error);
  }
};
