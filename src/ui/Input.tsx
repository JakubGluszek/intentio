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
      "w-full h-8 py-1 px-1 bg-primary/10 focus:shadow-inner focus:shadow-black/40 rounded-sm border-2 outline-none border-primary/20 focus:border-primary/50 placeholder:text-text/60";

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
