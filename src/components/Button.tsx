import React from "react";
import { HTMLMotionProps, motion } from "framer-motion";
import clsx from "clsx";

interface Props extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  transparent?: boolean;
  primary?: boolean;
  rounded?: boolean;
  shadow?: boolean;
  size?: "fill";
  innerRef?: React.MutableRefObject<HTMLButtonElement | null>;
}

const Button: React.FC<Props> = (props) => {
  const {
    children,
    transparent,
    size,
    innerRef,
    primary = false,
    rounded = true,
    shadow = false,
    disabled,
    style,
    ...restProps
  } = props;

  return (
    <motion.button
      className={clsx(
        "flex flex-row items-center justify-center font-bold gap-1 tracking-wider uppercase text-sm",
        rounded && "rounded",
        shadow && "shadow-2xl",
        transparent
          ? "bg-transparent text-primary/80 hover:text-primary focus:text-primary"
          : primary
            ? "bg-primary/80 hover:bg-primary px-2 text-window py-1"
            : "bg-primary/40 hover:bg-primary/80 px-2 text-window py-1"
      )}
      style={{
        width: size === "fill" ? "100%" : undefined,
        height: size === "fill" ? "100%" : undefined,
        ...style,
      }}
      disabled={disabled}
      whileTap={{
        scale: transparent ? 0.9 : 0.975,
      }}
      ref={innerRef}
      {...restProps}
    >
      {children}
    </motion.button>
  );
};

export default Button;
