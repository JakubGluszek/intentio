import React from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { clsx } from "@mantine/core";

interface ButtonConfig {
  base?: BaseVariant;
  ghost?: GhostVariant;
}

interface BaseVariant { }

interface GhostVariant {
  highlight: boolean;
}

export interface ButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant: "base" | "ghost";
  config?: ButtonConfig;
}

export const DefaultButtonConfig: ButtonConfig = {
  ghost: { highlight: true },
};

export const Button: React.FC<ButtonProps> = (props) => {
  const {
    children,
    type = "button",
    variant,
    config = {
      ghost: { highlight: true },
    },
    className: customClassName,
    tabIndex = -3,
    ...restProps
  } = props;

  let className =
    "h-fit w-fit flex flex-row items-center justify-center gap-1 p-1 rounded-sm font-bold uppercase transition-all ease-linear duration-150";

  if (variant === "base") {
    className = twMerge(
      className,
      "bg-base/20 hover:bg-primary/40 p-0 \
      text-text/80 hover:text-text active:text-primary \
      px-2 border-2 border-base/20 hover:border-transparent active:border-primary active:-translate-y-[1px] \
      hover:shadow hover:shadow-black/20 active:shadow-lg active:shadow-black/20"
    );
  } else if (variant === "ghost") {
    className = twMerge(
      className,
      clsx(
        "text-base hover:text-primary/80 bg-transparent active:text-primary p-0"
      )
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
