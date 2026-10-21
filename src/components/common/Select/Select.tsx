import type { ComponentPropsWithoutRef } from "react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { twMerge } from "tailwind-merge";

type SelectProps = Omit<
  ComponentPropsWithoutRef<"select">,
  "id" | "className" | "children"
> & {
  id: string;
  label?: string;
  labelVisibility?: "visible" | "sr-only";
  placeholder?: string;
  register?: UseFormRegisterReturn;
  options?: { value: string; label: string }[];
  className?: string;
};

export const Select = ({
  id,
  label,
  labelVisibility = "visible",
  placeholder,
  register,
  options,
  className,
  ...selectProps
}: SelectProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={id}
          className={
            labelVisibility === "sr-only"
              ? "sr-only"
              : "text-sm font-medium text-gray-800"
          }>
          {label}
        </label>
      )}
      <select
        id={id}
        {...(register ?? {})}
        {...selectProps}
        className={twMerge(
          "w-full min-w-0 truncate rounded border border-gray-300 p-2",
          className,
        )}>
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
