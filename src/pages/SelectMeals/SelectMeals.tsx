import { Link } from "react-router";
import { LuArrowLeft } from "react-icons/lu";
import { SelectMealsForm } from "@/components/SelectMealsForm";
import { Button } from "@/components/common/Button/Button";

export const SelectMeals = () => {
  return (
    <div className="flex flex-col gap-4 p-5">
      <h2 className="text-sm font-medium tracking-wider text-gray-800 uppercase">
        Select Meals
      </h2>
      <SelectMealsForm />
      <Link to="/" className="self-start">
        <Button color="neutral">
          <LuArrowLeft /> Home
        </Button>
      </Link>
    </div>
  );
};
