import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/hooks/useCollection";

export const Home = () => {
	const { user, logout } = useAuth();
	const meals = useCollection("meals");

	const fetchMeals = async () => {
		const mealDocs = await meals;
		if (mealDocs) {
			console.log(
				"Meals:",
				mealDocs.map(doc => doc.data())
			);
		}
	};

	return (
		<div className="p-8">
			<h1>Welcome, {user?.email}</h1>
			<button onClick={logout}>Logout</button>
			<button onClick={fetchMeals} style={{ marginLeft: 8 }}>
				Fetch Meals
			</button>
		</div>
	);
};
