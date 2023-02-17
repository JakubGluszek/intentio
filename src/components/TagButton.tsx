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
        "rounded text-sm font-semibold px-2 py-0.5 shadow whitespace-nowrap",
        isSelected
          ? "bg-primary/80 hover:bg-primary text-window/80"
          : "bg-text/60 hover:bg-text/80 text-window"
      )}
      {...restProps}
    >
      {children}
    </button>
  );
};

export default TagButton;
