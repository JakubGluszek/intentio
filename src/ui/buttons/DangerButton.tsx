import React from "react";
import { twMerge } from "tailwind-merge";

import { Button, ButtonProps } from "./Button";

export const DangerButton: React.FC<ButtonProps> = (props) => {
  const { className: customClassName, ...restProps } = props;

  let className =
    props.variant === "base"
      ? "bg-danger/20 hover:bg-danger/30 active:bg-danger border-danger/40 hover:border-danger/60 text-danger/80 hover:text-danger active:text-window"
      : "text-danger/80 hover:text-danger active:text-danger";

  if (customClassName) {
    className = twMerge(className, customClassName);
  }

  return (
    <Button className={className} {...restProps}>
      {props.children}
    </Button>
  );
};
