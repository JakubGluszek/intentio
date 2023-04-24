import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { clsx } from "@mantine/core";

export interface PaneProps extends HTMLMotionProps<"div"> {
  withPadding?: boolean;
}

export const Pane: React.FC<PaneProps> = (props) => {
  const {
    children,
    className: customClassName,
    withPadding = true,
    ...restProps
  } = props;

  let className = clsx(
    "flex bg-window/95 border-2 border-base/20 bg-gradient-to-br from-primary/5 via-window/5 to-base/5",
    withPadding && "p-1.5"
  );

  if (customClassName) {
    className = twMerge(className, customClassName);
  }

  return (
    <motion.div className={className} {...restProps}>
      {children}
    </motion.div>
  );
};
