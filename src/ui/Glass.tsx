import React from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

interface GlassProps extends HTMLMotionProps<"div"> { }

export const Glass: React.FC<GlassProps> = (props) => {
  const {
    children,
    className: customClassName,
    onMouseMove,
    ...restProps
  } = props;

  let className =
    "relative bg-base/5";

  if (customClassName) {
    className = twMerge(className, customClassName);
  }

  return (
    <motion.div className={className} {...restProps}>
      {children}
    </motion.div>
  );
};
