import type { DocumentData } from "firebase/firestore";
import type { UseFormRegisterReturn } from "react-hook-form";

type FormSelectProps = {
  id: string;
  label?: string;
  placeholder?: string;
  mealList: DocumentData[];
  register: UseFormRegisterReturn;
};

export const FormSelect = ({
  id,
  label,
  placeholder,
  mealList,
  register,
}: FormSelectProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="font-medium">
          {label}
        </label>
      )}
      <select id={id} {...(register ?? {})} className="border p-1">
        {placeholder && (
          <option value="" className="text-gray-600">
            {placeholder}
          </option>
        )}
        {mealList.map((meal) => (
          <option key={meal.id} value={meal.id}>
            {meal.name}
          </option>
        ))}
      </select>
    </div>
  );
};
