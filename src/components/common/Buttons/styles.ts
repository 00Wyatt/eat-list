export type ButtonBaseProps = {
  color?: "primary" | "neutral" | "danger" | "emphasized";
  size?: "small" | "large";
  variant?: "solid" | "ghost" | "disabled";
  loading?: boolean;
  className?: string;
  children: React.ReactNode;
};

export const colorClasses = {
  primary: "bg-sky-100 text-sky-600",
  neutral: "bg-gray-100 text-gray-800",
  danger: "bg-red-100 text-red-600",
  emphasized: "bg-sky-600 text-white active:bg-sky-700",
};

export const sizeClasses = {
  small: "px-2 py-1",
  large: "px-4 py-2",
};

export const variantClasses = {
  solid: "",
  ghost: "bg-transparent",
  disabled: "opacity-50 cursor-not-allowed",
};