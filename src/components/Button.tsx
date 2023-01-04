import React from "react";
import {
  HTMLMotionProps,
  motion,
  MotionStyle,
  TargetAndTransition,
} from "framer-motion";

interface Props extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  color?: "primary" | "danger";
  transparent?: boolean;
  opacity?: number;
  rounded?: boolean;
  innerRef?: React.MutableRefObject<HTMLButtonElement | null>;
}

const Button: React.FC<Props> = (props) => {
  const {
    children,
    transparent = false,
    color = "primary",
    rounded = true,
    disabled = false,
    opacity = 0.8,
    style,
    innerRef,
    ...restProps
  } = props;

  const [hover, setHover] = React.useState(false);

  const colors = (): { base: MotionStyle; hover: TargetAndTransition } => {
    if (transparent) {
      return {
        base: {
          backgroundColor: "transparent",
          color: "rgb(var(--primary-color) / 0.8)",
        },
        hover: {
          color: "rgb(var(--primary-color) / 1.0)",
        },
      };
    } else if (color === "primary") {
      return {
        base: {
          backgroundColor: "rgb(var(--primary-color) / 0.8)",
          color: "rgb(var(--window-color))",
        },
        hover: {
          backgroundColor: "rgb(var(--primary-color) / 1.0)",
          color: "rgb(var(--window-color))",
        },
      };
    } else if (color === "danger") {
      return {
        base: {
          backgroundColor: "rgb(var(--danger-color) / 0.8)",
          color: "rgb(var(--window-color))",
        },
        hover: {
          backgroundColor: "rgb(var(--danger-color) / 1.0)",
          color: "rgb(var(--window-color) / 1.0)",
        },
      };
    }

    return { base: {}, hover: {} };
  };

  return (
    <motion.button
      style={{
        // base
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        fontWeight: "bold",
        gap: "0.25rem",
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        borderRadius: rounded ? "0.25rem" : undefined,
        paddingTop: !transparent ? "0.25rem" : undefined,
        paddingBottom: !transparent ? "0.25rem" : undefined,
        paddingInline: !transparent ? "0.5rem" : undefined,
        width: !transparent ? "100%" : undefined,
        height: !transparent ? "100%" : undefined,
        opacity: hover ? 1.0 : opacity,

        ...colors().base,
        ...style,
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
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
