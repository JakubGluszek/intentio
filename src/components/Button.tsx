import React from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import clsx from "clsx";

interface Props extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  transparent?: boolean;
  ref?: React.MutableRefObject<HTMLButtonElement | null>;
}

const Button: React.FC<Props> = (props) => {
  const { children, transparent, ...restProps } = props;

  return (
    <motion.button
      className={clsx(
        "flex flex-row items-center justify-center font-bold gap-2 py-1 brightness-[80%] hover:brightness-100 tracking-widest uppercase",
        transparent
          ? "bg-transparent text-primary"
          : "bg-primary px-4 text-window rounded"
      )}
      whileHover={{ scale: transparent ? 1.05 : undefined }}
      whileTap={{ scale: 0.95 }}
      {...restProps}
    >
      {children}
    </motion.button>
  );
};

export default Button;
