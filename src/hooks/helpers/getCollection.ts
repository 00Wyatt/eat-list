import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

export const getCollection = async (collectionName: string) => {
  try {
    const collectionRef = collection(db, collectionName);
    const collectionSnapshot = await getDocs(collectionRef);
    return collectionSnapshot.docs;
  } catch (error) {
    console.error(`Failed to fetch collection "${collectionName}":`, error);
    return null;
  }
};
