import type { ButtonHTMLAttributes, ReactNode } from "react";

type BaseProps = {
  variant: "primary" | "secondary" | "default" | "increment" | "decrement";
  size: "sm" | "md" | "lg";
  buttonType: "icon" | "text" | "textWithIcon";
  className?: string;
};

type IconButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
    buttonType: "icon";
    icon: ReactNode;
    ariaLabel: string;
    children?: never;
  };

type TextButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    buttonType: "text";
    icon?: never;
    iconPosition?: never;
  };

type TextWithIconButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    buttonType: "textWithIcon";
    children: ReactNode;
    icon: ReactNode;
    iconPosition?: "left" | "right";
  };

export type ButtonProps =
  | IconButtonProps
  | TextButtonProps
  | TextWithIconButtonProps;

export function Button(props: ButtonProps) {
  const {
    variant,
    size,
    buttonType,
    className,
    type = "button",
    ...rest
  } = props;

  const classes = [
    "button",
    `button--${variant}`,
    `button--${size}`,
    `button--${buttonType}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (buttonType === "icon") {
    const { icon, ariaLabel, ...buttonProps } = rest as IconButtonProps;

    return (
      <button
        className={classes}
        type={type}
        aria-label={ariaLabel}
        {...buttonProps}
      >
        <span className="button__icon">{icon}</span>
      </button>
    );
  }

  if (buttonType === "text") {
    const { children, ...buttonProps } = rest as TextButtonProps;

    return (
      <button className={classes} type={type} {...buttonProps}>
        <span className="button__label">{children}</span>
      </button>
    );
  }

  const {
    children,
    icon,
    iconPosition = "right",
    ...buttonProps
  } = rest as TextWithIconButtonProps;

  return (
    <button className={classes} type={type} {...buttonProps}>
      {iconPosition === "left" && <span className="button__icon">{icon}</span>}

      <span className="button__label">{children}</span>

      {iconPosition === "right" && <span className="button__icon">{icon}</span>}
    </button>
  );
}
