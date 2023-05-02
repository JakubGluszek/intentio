import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { clsx } from "@mantine/core";

export interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  active?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (props, ref) => {
    const {
      children,
      active,
      className: customClassName,
      ...restProps
    } = props;

    let className = clsx(
      "bg-darker/20 hover:bg-darker/[15%] p-1.5 border-2 rounded-sm transition-colors",
      active
        ? "border-primary/60 hover:border-primary/80 text-primary/80 shadow-lg shadow-black/40"
        : "border-base/30 hover:border-base/40 shadow shadow-black/20"
    );

    if (customClassName) {
      className = twMerge(className, customClassName);
    }

    return (
      <motion.div ref={ref} className={className} {...restProps}>
        {children}
      </motion.div>
    );
  }
);
