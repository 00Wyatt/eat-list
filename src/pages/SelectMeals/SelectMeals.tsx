import { Link } from "react-router";
import { LuArrowLeft } from "react-icons/lu";
import { SelectMealsForm } from "@/components/SelectMealsForm";
import { Button } from "@/components/common/Buttons/Button";

export const SelectMeals = () => {
  return (
    <div className="flex w-full flex-col gap-2 p-5">
      <h2 className="mb-2 text-sm font-medium tracking-wider text-gray-800 uppercase">
        Select Meals
      </h2>
      <SelectMealsForm />
      <Link to="/weekly-meals">
        <Button color="neutral" className="w-full">
          <LuArrowLeft /> Weekly Meals
        </Button>
      </Link>
    </div>
  );
};
