import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { clsx } from "@mantine/core";

export interface PaneProps extends HTMLMotionProps<"div"> { }

export const Pane: React.FC<PaneProps> = (props) => {
  const [isHover, setIsHover] = React.useState(false);

  const {
    children,
    className: customClassName,
    onHoverStart,
    onHoverEnd,
    ...restProps
  } = props;

  let className = clsx(
    "flex p-1 rounded border-2 bg-window/95 bg-gradient-to-br from-primary/5 via-window/5 to-base/5 transition-colors duration-500",
    isHover ? "border-base/40" : "border-base/30"
  );

  if (customClassName) {
    className = twMerge(className, customClassName);
  }

  return (
    <motion.div
      className={className}
      onHoverStart={(e, info) => {
        onHoverStart?.(e, info);
        setIsHover(true);
      }}
      onHoverEnd={(e, info) => {
        onHoverEnd?.(e, info);
        setIsHover(false);
      }}
      {...restProps}
    >
      {children}
    </motion.div>
  );
};
