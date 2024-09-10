import React from "react";
import classnames from "classnames";
import { IconType } from "react-icons";

// styles components
import Link from "next/link";
import buttonStyles from "./button.module.scss";

interface ButtonProps {
  format?:
    | "primary"
    | "secondary"
    | "info"
    | "success"
    | "danger"
    | "none"
    | "warning"
    | "chat"
    | "teal"
    | "white";

  size?: "lg" | "xl" | "md" | "sm" | "xs" | "db" | "none";
  borderRadius?:
    | "zero"
    | "five"
    | "ten"
    | "twenty"
    | "thirty"
    | "fourty"
    | "fifty";
  href?: string;
  target?: "_blank" | "_self" | "_parent" | "_top" | "framename";
  type?: "button" | "submit" | "reset";
  leftIcon?: any;
  rightIcon?: any;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: any;
  style?: any;
  onChange?: (value: {}) => void;
  width?: "full-width" | "ajust";
  tag?: "main-tag" | "active-tag";
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
}
export const GlobalButton = ({
  format = "primary",
  size = "md",
  href = "",
  disabled = false,
  target,
  type = "button",
  leftIcon,
  rightIcon,
  className,
  style,
  children,
  onClick,
  onChange,
  width = "ajust",
  borderRadius = "five",
  tag,
}: ButtonProps) => {
  if (href && target) {
    return (
      <Link
        href={href}
        target={target}
        className={classnames(
          buttonStyles.btn,
          buttonStyles["btn-" + format],
          buttonStyles["btn-" + size],
          buttonStyles["btn-" + width],
          buttonStyles["btn-" + borderRadius],
          buttonStyles[tag === "main-tag" ? "main-tag" : ""],
          buttonStyles[tag === "active-tag" ? "active-tag" : ""],
          className
        )}
        style={style}
      >
        <span>
          {leftIcon && <span>{leftIcon}</span>} {children}{" "}
          {rightIcon && <span>{rightIcon}</span>}
        </span>
      </Link>
    );
  }
  if (href) {
    return (
      <Link
        href={href}
        className={classnames(
          buttonStyles.btn,
          buttonStyles["btn-" + format],
          buttonStyles["btn-" + size],
          buttonStyles["btn-" + width],
          buttonStyles["btn-" + borderRadius],
          buttonStyles[tag === "main-tag" ? "main-tag" : ""],
          buttonStyles[tag === "active-tag" ? "active-tag" : ""],
          className
        )}
        style={style}
      >
        <span>
          {leftIcon && <span>{leftIcon}</span>} {children}{" "}
          {rightIcon && <span>{rightIcon}</span>}
        </span>
      </Link>
    );
  }

  return (
    <button
      className={classnames(
        buttonStyles.btn,
        buttonStyles["btn-" + format],
        buttonStyles["btn-" + size],
        buttonStyles["btn-" + width],
        buttonStyles["btn-" + borderRadius],
        buttonStyles[tag === "main-tag" ? "main-tag" : ""],
        buttonStyles[tag === "active-tag" ? "active-tag" : ""],
        className
      )}
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      onChange={onChange}
    >
      <span>
        {leftIcon && <span>{leftIcon}</span>} {children}{" "}
        {rightIcon && <span>{rightIcon}</span>}
      </span>
    </button>
  );
};
