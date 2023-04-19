import React from "react";
import { twMerge } from "tailwind-merge";

export interface InputProps extends React.HTMLProps<HTMLInputElement> { }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const {
      className: customClassName,
      tabIndex = -3,
      autoComplete = "off",
      autoFocus = false,
      type = "text",
      ...restProps
    } = props;

    let className =
      "w-full h-8 py-1 px-2 bg-darker/20 rounded-sm border-2 outline-none border-primary/40 focus:border-primary/80 placeholder:text-text/60";

    if (customClassName) {
      className = twMerge(className, customClassName);
    }

    return (
      <input
        {...restProps}
        className={className}
        ref={ref}
        tabIndex={tabIndex}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        type={type}
      />
    );
  }
);
