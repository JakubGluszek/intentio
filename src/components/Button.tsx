import React from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import clsx from "clsx";

interface Props extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  transparent?: boolean;
  innerRef?: React.MutableRefObject<HTMLButtonElement | null>;
}

const Button: React.FC<Props> = (props) => {
  const { children, transparent, innerRef, disabled, ...restProps } = props;

  return (
    <motion.button
      className={clsx(
        "flex flex-row items-center justify-center brightness-[85%] hover:brightness-100 font-bold gap-2 py-1 tracking-widest uppercase",
        transparent
          ? "bg-transparent text-primary"
          : "bg-primary px-4 text-window rounded"
      )}
      tabIndex={-1} // necessary, otherwise windows crash randomly (on linux at least)
      disabled={disabled}
      whileTap={{ scale: transparent ? 0.9 : 0.975 }}
      ref={innerRef}
      {...restProps}
    >
      {children}
    </motion.button>
  );
};

export default Button;
