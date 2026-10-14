import { Link } from "react-router";
import { twMerge } from "tailwind-merge";
import { CgSpinner } from "react-icons/cg";
import {
  colorClasses,
  sizeClasses,
  variantClasses,
  type ButtonBaseProps,
} from "../styles";

type LinkButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  ButtonBaseProps & {
    to?: string;
  };

export const LinkButton = ({
  to = "#",
  color = "primary",
  size = "large",
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
    <Link
      to={props.href || to}
      className={twMerge(
        "flex items-center justify-center gap-1 rounded duration-200",
        `${colorClasses[color]}`,
        `${sizeClasses[size]}`,
        `${variantClasses[variant]}`,
        className,
      )}
      {...props}>
      {loading ? <CgSpinner size={24} className="animate-spin" /> : children}
    </Link>
  );
};
