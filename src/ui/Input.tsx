import React from "react";

export interface InputProps extends React.HTMLProps<HTMLInputElement> { }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const {
      style: customStyle,
      tabIndex = -3,
      autoComplete = "off",
      autoFocus = false,
      type = "text",
      onFocus,
      onBlur,
      ...restProps
    } = props;

    const [isFocus, setIsFocus] = React.useState(autoFocus);

    const getStyle = (): React.CSSProperties => {
      let style: React.CSSProperties = {
        width: "100%",
        height: "2rem",
        padding: "0.25rem",
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem",
        backgroundColor: "rgb(0, 0, 0, 0.2)",
        borderRadius: 1,
        borderWidth: 2,
        outline: "none",
      };

      style.borderColor = isFocus
        ? "rgb(var(--primary-color) / 0.8)"
        : "rgb(var(--primary-color) / 0.4)";

      return style;
    };

    const style = getStyle();

    return (
      <input
        {...restProps}
        ref={ref}
        style={{ ...style, ...customStyle }}
        tabIndex={tabIndex}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        type={type}
        onFocus={(e) => {
          setIsFocus(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setIsFocus(false);
          onBlur?.(e);
        }}
      />
    );
  }
);
