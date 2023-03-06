import React from "react";
import { HTMLMotionProps, motion, MotionStyle } from "framer-motion";

interface Props extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  color?: "primary" | "danger";
  transparent?: boolean;
  opacity?: number;
  rounded?: boolean;
  isSelected?: boolean;
  highlight?: boolean;
  innerRef?: React.MutableRefObject<HTMLButtonElement | null>;
}

const Button: React.FC<Props> = (props) => {
  const {
    type = "button",
    children,
    transparent = false,
    highlight = true,
    color = "primary",
    rounded = true,
    disabled = false,
    isSelected = false,
    opacity = 0.8,
    style,
    innerRef,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    tabIndex = -2,
    ...restProps
  } = props;

  const [isHover, setIsHover] = React.useState(false);
  const [isMouseDown, setIsMouseDown] = React.useState(false);

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

  const handleOnMouseDown = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setIsMouseDown(true);
    onMouseDown && onMouseDown(e);
  };

  const handleOnMouseUp = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setIsMouseDown(false);
    onMouseUp && onMouseUp(e);
  };

  const colors = (): MotionStyle => {
    let shadow = {
      "--tw-shadow":
        "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
      "--tw-shadow-colored":
        "0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color)",
      boxShadow:
        "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)",
    };

    if (transparent) {
      return {
        backgroundColor:
          highlight && (isHover || isSelected)
            ? color === "primary"
              ? "rgb(var(--primary-color) / 0.15)"
              : "rgb(var(--danger-color) / 0.15)"
            : "transparent",
        color:
          color === "primary"
            ? "rgb(var(--primary-color))"
            : "rgb(var(--danger-color))",
      };
    } else if (color === "primary") {
      return {
        backgroundColor:
          isSelected || isHover
            ? "rgb(var(--primary-color))"
            : "rgb(var(--base-color))",
        color:
          isSelected || isHover
            ? "rgb(var(--window-color))"
            : "rgb(var(--primary-color))",
        ...shadow,
      };
    } else if (color === "danger") {
      return {
        backgroundColor: "rgb(var(--danger-color))",
        color: "rgb(var(--window-color))",
        ...shadow,
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
        paddingTop: !transparent ? "0.25rem" : "0.25rem",
        paddingBottom: !transparent ? "0.25rem" : "0.25rem",
        paddingInline: !transparent ? "0.75rem" : "0.25rem",
        width: !transparent ? "100%" : undefined,
        height: !transparent ? "100%" : undefined,
        opacity: isHover ? 1.0 : opacity,
        cursor: disabled ? "not-allowed" : "pointer",

        ...colors(),
        ...style,
      }}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      onMouseDown={handleOnMouseDown}
      onMouseUp={handleOnMouseUp}
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
