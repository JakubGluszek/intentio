import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { clsx } from "@mantine/core";

export interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  active?: boolean;
  clickable?: boolean;
  withBorder?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (props, ref) => {
    const {
      children,
      active,
      withBorder = false,
      clickable = false,
      className: customClassName,
      ...restProps
    } = props;

    let className = clsx(
      "flex flex-col group bg-base/[15%] backdrop-blur-sm p-1.5 rounded-sm transition-all duration-150",
      active
        ? "border-primary/60 hover:border-primary/80 text-primary/80"
        : "border-base/30 hover:border-base/40 shadow shadow-black/20",
      withBorder && "border-2 border-base/30 hover:border-base/40",
      clickable ? "hover:bg-primary/20 active:bg-primary/30" : "hover:bg-base/20"
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
