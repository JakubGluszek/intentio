import React from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant: "base" | "ghost";
  active?: boolean;
}

export const Button: React.FC<ButtonProps> = (props) => {
  const {
    children,
    className: customClassName,
    variant,
    active = false,
    type = "button",
    tabIndex = -3,
    ...restProps
  } = props;

  let className =
    "h-8 w-fit flex flex-row items-center justify-center gap-1 p-1 font-bold uppercase";

  if (variant === "base") {
    className = twMerge(
      className,
      "text-primary/80 hover:text-primary active:text-window bg-primary/10 active:bg-primary px-3 border-2 border-primary/40 hover:border-primary/60 rounded-sm"
    );
  } else if (variant === "ghost") {
    className = twMerge(
      className,
      "bg-transparent text-base hover:text-primary active:text-primary"
    );
  }

  if (customClassName) {
    className = twMerge(className, customClassName);
  }

  return (
    <motion.button
      {...restProps}
      className={className}
      type={type}
      tabIndex={tabIndex}
    >
      {children}
    </motion.button>
  );
};
