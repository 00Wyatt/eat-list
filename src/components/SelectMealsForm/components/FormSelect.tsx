import type { UseFormRegisterReturn } from "react-hook-form";
import type { Meal } from "@/types";

type FormSelectProps = {
  id: string;
  label?: string;
  placeholder?: string;
  mealList?: Meal[];
  register: UseFormRegisterReturn;
  extraOptions?: { value: string; label: string }[];
};

export const FormSelect = ({
  id,
  label,
  placeholder,
  mealList,
  register,
  extraOptions,
}: FormSelectProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-800">
          {label}
        </label>
      )}
      <select
        id={id}
        {...(register ?? {})}
        className="rounded border border-gray-300 p-2">
        {placeholder && (
          <option value="" className="text-gray-700">
            {placeholder}
          </option>
        )}
        {mealList?.map((meal) => (
          <option key={meal.id} value={meal.id}>
            {meal.name}
          </option>
        ))}
        {extraOptions?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
