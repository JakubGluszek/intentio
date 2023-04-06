import React from "react";
import { clsx } from "@mantine/core";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  children: React.ReactNode;
  isSelected?: boolean;
}

const TagButton: React.FC<Props> = (props) => {
  const { isSelected, children, ...restProps } = props;

  return (
    <button
      tabIndex={-2}
      className={clsx(
        "rounded text-sm font-semibold shadow hover:shadow-lg -hover:translate-y-0.5 hover:shadow-black/40 whitespace-nowrap",
        isSelected
          ? "bg-base/100 hover:bg-base text-primary/80 hover:text-primary"
          : "bg-text/50 hover:bg-text/60 text-window"
      )}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default TagButton;
