import { twMerge } from "tailwind-merge";
import { CgSpinner } from "react-icons/cg";
import {
  colorClasses,
  sizeClasses,
  variantClasses,
  type ButtonBaseProps,
} from "../styles";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonBaseProps;

export const Button = ({
  color = "primary",
  size = "large",
  variant = "solid",
  loading = false,
  className,
  children,
  ...props
}: ButtonProps) => {
  if (loading || props.disabled) {
    variant = "disabled";
  }

  return (
    <button
      type={props.type || "button"}
      disabled={variant === "disabled"}
      className={twMerge(
        "flex items-center justify-center gap-1 rounded duration-200",
        `${colorClasses[color]}`,
        `${sizeClasses[size]}`,
        `${variantClasses[variant]}`,
        className,
      )}
      {...props}>
      {loading ? <CgSpinner size={24} className="animate-spin" /> : children}
    </button>
  );
};
