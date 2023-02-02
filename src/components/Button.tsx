import React from "react";
import { HTMLMotionProps, motion, MotionStyle } from "framer-motion";

interface Props extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  color?: "primary" | "danger" | "base";
  transparent?: boolean;
  opacity?: number;
  rounded?: boolean;
  innerRef?: React.MutableRefObject<HTMLButtonElement | null>;
}

const Button: React.FC<Props> = (props) => {
  const {
    type = "button",
    children,
    transparent = false,
    color = "primary",
    rounded = true,
    disabled = false,
    opacity = 0.8,
    style,
    innerRef,
    onMouseEnter,
    onMouseLeave,
    tabIndex = -2,
    ...restProps
  } = props;

  const [isHover, setIsHover] = React.useState(false);

  const handleOnMouseEnter = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setIsHover(true);
    onMouseEnter && onMouseEnter(e);
  };

  const handleOnMouseLeave = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setIsHover(false);
    onMouseLeave && onMouseLeave(e);
  };

  const colors = (): MotionStyle => {
    if (transparent) {
      return {
        backgroundColor: "transparent",
        color:
          color === "primary"
            ? "rgb(var(--primary-color) / 0.8)"
            : "rgb(var(--danger-color) / 0.8)",
      };
    } else if (color === "primary") {
      return {
        backgroundColor: "rgb(var(--primary-color) / 0.8)",
        color: "rgb(var(--window-color))",
      };
    } else if (color === "danger") {
      return {
        backgroundColor: "rgb(var(--danger-color) / 0.8)",
        color: "rgb(var(--window-color))",
      };
    } else if (color === "base") {
      return {
        backgroundColor: "rgb(var(--base-color) / 0.8)",
        color: "rgb(var(--primary-color))",
      };
    }

    return {};
  };

  return (
    <motion.button
      type={type}
      style={{
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
        paddingInline: !transparent ? "0.75rem" : undefined,
        width: !transparent ? "100%" : undefined,
        height: !transparent ? "100%" : undefined,
        opacity: isHover ? 1.0 : opacity,

        ...colors(),
        ...style,
      }}
      whileTap={{ scale: transparent ? 0.8 : undefined }}
      whileFocus={{ opacity: 1.0 }}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      disabled={disabled}
      tabIndex={tabIndex}
      ref={innerRef}
      {...restProps}
    >
      {children}
    </motion.button>
  );
};

export default Button;
