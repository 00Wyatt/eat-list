import { twMerge } from "tailwind-merge";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  color?: "primary" | "neutral" | "danger" | "emphasized";
  size?: "small" | "large";
  variant?: "solid" | "ghost" | "disabled";
  className?: string;
  children: React.ReactNode;
};

const colorClasses = {
  primary: "bg-sky-100 text-sky-600",
  neutral: "bg-gray-100 text-gray-800",
  danger: "bg-red-100 text-red-600",
  emphasized: "bg-sky-600 text-white active:bg-sky-700",
};

const sizeClasses = {
  small: "px-2 py-1",
  large: "px-4 py-2",
};

const variantClasses = {
  solid: "",
  ghost: "bg-transparent",
  disabled: "opacity-50 cursor-not-allowed",
};

export const Button = ({
  color = "primary",
  size = "small",
  variant = "solid",
  className,
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={twMerge(
        "flex items-center justify-center gap-1 rounded duration-200",
        `${colorClasses[color]}`,
        `${sizeClasses[size]}`,
        `${variantClasses[variant]}`,
        className,
      )}
      {...props}>
      {children}
    </button>
  );
};
