import type { UseFormRegisterReturn } from "react-hook-form";

type FormSelectProps = {
  id: string;
  label?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  options?: { value: string; label: string }[];
};

export const FormSelect = ({
  id,
  label,
  placeholder,
  register,
  options,
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
        className="min-w-0 truncate rounded border border-gray-300 p-2">
        {placeholder && (
          <option value="" className="text-gray-700">
            {placeholder}
          </option>
        )}
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
