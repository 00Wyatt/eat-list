import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/hooks/useCollection";
import { Separator } from "radix-ui";

export const Home = () => {
  const { user, logout } = useAuth();
  const meals = useCollection("meals");

  const fetchMeals = async () => {
    const mealDocs = await meals;
    if (mealDocs) {
      console.log(
        "Meals:",
        mealDocs.map((doc) => doc.data()),
      );
    }
  };

  return (
    <div className="p-8">
      <div className="flex max-w-64 flex-col items-start gap-4">
        <h1>Welcome, {user?.email}</h1>
        <div className="flex">
          <a href="/create-list" className="text-blue-500 underline">
            Create Shopping List
          </a>
        </div>
        <Separator.Root className="my-5 h-[1px] w-100 bg-gray-300" />
        <button
          onClick={logout}
          className="cursor-pointer border border-gray-500 p-2 hover:bg-gray-200"
        >
          Logout
        </button>
        <button
          onClick={fetchMeals}
          className="cursor-pointer border border-gray-500 p-2 hover:bg-gray-200"
        >
          Fetch Meals
        </button>
      </div>
    </div>
  );
};
