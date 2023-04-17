import React from "react";
import { HTMLMotionProps, motion, MotionStyle } from "framer-motion";

export interface ButtonProps extends HTMLMotionProps<"button"> {
  children: React.ReactNode;
  variant: "base" | "ghost";
}

export const Button: React.FC<ButtonProps> = (props) => {
  const {
    children,
    variant,
    type = "button",
    tabIndex = -3,
    style: customStyle,
    onMouseOver,
    onMouseLeave,
    onMouseDown,
    onMouseUp,
    ...restProps
  } = props;

  const [isHover, setIsHover] = React.useState(false);
  const [isActive, setIsActive] = React.useState(false);

  const getBaseStyle = (): MotionStyle => {
    let style: MotionStyle = {
      paddingLeft: "0.75rem",
      paddingRight: "0.75rem",
      borderWidth: 2,
      borderColor: "rgb(var(--primary-color) / 0.6)",
      borderRadius: 2,
    };

    style.backgroundColor = isActive
      ? "rgb(var(--primary-color))"
      : "rgb(var(--base-color))";

    style.color = isActive
      ? "rgb(var(--window-color))"
      : "rgb(var(--primary-color))";

    return style;
  };

  const getGhostStyle = (): MotionStyle => {
    let style: MotionStyle = {
      backgroundColor: "transparent",
      color: "rgb(var(--primary-color))",
    };

    return style;
  };

  const getStyle = (): MotionStyle => {
    let style: MotionStyle = {
      minHeight: "2rem",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.25rem",
      padding: "0.25rem",
      fontSize: "1.1rem",
      fontWeight: 900,
      fontFamily: "monospace",
      textTransform: "uppercase",
    };

    if (variant === "base") {
      style = { ...style, ...getBaseStyle() };
    } else if (variant === "ghost") {
      style = { ...style, ...getGhostStyle() };
    }

    style.opacity = isHover ? 1.0 : 0.8;

    return style;
  };

  const style = getStyle();

  return (
    <motion.button
      {...restProps}
      type={type}
      tabIndex={tabIndex}
      style={{ ...style, ...customStyle }}
      onMouseOver={(e) => {
        setIsHover(true);
        onMouseOver?.(e);
      }}
      onMouseLeave={(e) => {
        setIsHover(false);
        setIsActive(false);
        onMouseLeave?.(e);
      }}
      onMouseDown={(e) => {
        setIsActive(true);
        onMouseDown?.(e);
      }}
      onMouseUp={(e) => {
        setIsActive(false);
        onMouseUp?.(e);
      }}
    >
      {children}
    </motion.button>
  );
};
