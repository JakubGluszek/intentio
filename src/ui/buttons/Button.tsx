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
    "h-8 w-fit flex flex-row items-center justify-center gap-1 p-1 rounded-sm font-bold uppercase transition-all ease-linear duration-150";

  if (variant === "base") {
    className = twMerge(
      className,
      "text-primary/90 hover:text-primary active:text-window \
      bg-primary/10 active:bg-primary border-primary/40 hover:border-primary/60 \
      px-2 border-2 active:-translate-y-[1px] \
      hover:shadow hover:shadow-black/40 active:shadow-lg active:shadow-black/60"
    );
  } else if (variant === "ghost") {
    className = twMerge(
      className,
      clsx(
        "text-base hover:text-primary/80",
        config?.ghost?.highlight === true
          ? "hover:bg-base/20 active:bg-base/30"
          : "bg-transparent active:text-primary"
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
