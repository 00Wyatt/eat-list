import { useState } from "react";

export type ComboboxOption = {
  value: string;
  label: string;
};

type ComboboxProps = {
  id: string;
  options: ComboboxOption[];
  value: string;
  onValueChange: (value: string) => void;
  onBlur?: () => void;
  label?: string;
  labelVisibility?: "visible" | "sr-only";
  placeholder?: string;
  allowCustomValue?: boolean;
  disabled?: boolean;
};

export const Combobox = ({
  id,
  options,
  value,
  onValueChange,
  onBlur,
  label,
  labelVisibility = "visible",
  placeholder = "Search...",
  allowCustomValue = false,
  disabled = false,
}: ComboboxProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selectedOption = options.find((option) => option.value === value);
  const filteredOptions = options.filter((option) =>
    option.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );
  const inputValue = isOpen
    ? query
    : (selectedOption?.label ?? (allowCustomValue ? value : ""));

  const selectOption = (option: ComboboxOption) => {
    onValueChange(option.value);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div
      className={`relative flex w-full min-w-0 flex-col gap-1 ${isOpen ? "z-50" : ""}`}>
      {label ? (
        <label
          htmlFor={id}
          className={
            labelVisibility === "sr-only"
              ? "sr-only"
              : "text-sm font-medium text-gray-800"
          }>
          {label}
        </label>
      ) : null}
      <input
        id={id}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={isOpen}
        aria-controls={`${id}-options`}
        value={inputValue}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full min-w-0 rounded border border-gray-300 bg-white p-2 disabled:cursor-not-allowed disabled:bg-gray-100"
        onFocus={() => {
          setQuery(allowCustomValue && !selectedOption ? value : "");
          setIsOpen(true);
        }}
        onChange={(event) => {
          const nextQuery = event.target.value;
          setQuery(nextQuery);
          setIsOpen(true);
          if (allowCustomValue) {
            onValueChange(nextQuery);
          }
        }}
        onBlur={() => {
          setIsOpen(false);
          setQuery("");
          onBlur?.();
        }}
      />
      {isOpen && (
        <ul
          id={`${id}-options`}
          role="listbox"
          className="absolute top-full left-0 z-20 mt-1 max-h-72 w-full overflow-y-auto rounded border border-gray-300 bg-white py-1 shadow-lg">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                className="flex w-full cursor-pointer items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-100"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectOption(option)}>
                {option.label}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-sm text-gray-600">
              {allowCustomValue
                ? "No matching meals. Custom name will be used."
                : "No matching meals."}
            </li>
          )}
        </ul>
      )}
    </div>
  );
};
