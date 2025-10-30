import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

export const useCollection = async (collectionName: string) => {
	try {
		const colRef = collection(db, collectionName);
		const colSnapshot = await getDocs(colRef);
		return colSnapshot.docs;
	} catch (error) {
		console.error(error);
	}
};
