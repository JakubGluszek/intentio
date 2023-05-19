import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { clsx } from "@mantine/core";

export interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  active?: boolean;
  clickable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (props, ref) => {
    const {
      children,
      active,
      clickable = false,
      className: customClassName,
      ...restProps
    } = props;

    let className = clsx(
      "flex flex-col border border-base/10 hover:border-base/30 text-sm group bg-gradient-to-br bg-base/10 from-primary/5 via-transparent to-primary/5 backdrop-blur-sm p-1.5 rounded-sm transition-all duration-150 shadow shadow-black/30",
      clickable
        ? "hover:bg-primary/10 active:bg-primary/20"
        : "hover:bg-base/[15%]"
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
