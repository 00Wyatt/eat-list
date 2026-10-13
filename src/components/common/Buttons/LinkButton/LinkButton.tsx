import { twMerge } from "tailwind-merge";
import { CgSpinner } from "react-icons/cg";
import {
  colorClasses,
  sizeClasses,
  variantClasses,
  type ButtonBaseProps,
} from "../styles";

type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  ButtonBaseProps;

export const LinkButton = ({
  color = "primary",
  size = "small",
  variant = "solid",
  loading = false,
  className,
  children,
  ...props
}: LinkButtonProps) => {
  if (loading) {
    variant = "disabled";
  }

  return (
    <a
      className={twMerge(
        "flex items-center justify-center gap-1 rounded duration-200",
        `${colorClasses[color]}`,
        `${sizeClasses[size]}`,
        `${variantClasses[variant]}`,
        className,
      )}
      {...props}>
      {loading ? <CgSpinner size={24} className="animate-spin" /> : children}
    </a>
  );
};
