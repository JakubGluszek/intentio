import React from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import clsx from "clsx";

interface Props extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  transparent?: boolean;
  color?: "primary";
  size?: "fill";
  innerRef?: React.MutableRefObject<HTMLButtonElement | null>;
}

const Button: React.FC<Props> = (props) => {
  const {
    children,
    transparent,
    color,
    size,
    innerRef,
    disabled,
    style,
    ...restProps
  } = props;

  return (
    <motion.button
      className={clsx(
        "flex flex-row items-center justify-center font-bold gap-1 tracking-wider uppercase",
        transparent
          ? "bg-transparent text-primary/80 hover:text-primary"
          : color === "primary"
            ? "bg-primary/80 hover:bg-primary px-2 text-window rounded py-1"
            : "bg-base/80 hover:bg-base/100 px-2 text-primary rounded py-1"
      )}
      style={{
        width: size === "fill" ? "100%" : undefined,
        height: size === "fill" ? "100%" : undefined,
        ...style,
      }}
      disabled={disabled}
      whileTap={{
        scale: transparent ? 0.9 : undefined,
      }}
      ref={innerRef}
      {...restProps}
    >
      {children}
    </motion.button>
  );
};

export default Button;
