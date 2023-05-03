import { clsx } from "@mantine/core";
import React from "react";
import { IconType } from "react-icons";
import { Pane } from "../Pane";

import { Button, ButtonProps } from "./Button";

export interface PaneButtonProps extends Partial<ButtonProps> {
  active: boolean;
  icon: IconType;
}

export const PaneButton: React.FC<PaneButtonProps> = (props) => {
  const { children, variant = "ghost", ...restProps } = props;

  return (
    <Pane
      className={clsx(
        "h-full hover:border-primary/50 p-0 duration-150",
        props.active && "border-primary/50 hover:border-primary/60"
      )}
    >
      <Button
        className={clsx(
          "h-full",
          props.active &&
          "bg-primary/10 hover:bg-primary/20 text-primary/80 hover:text-primary"
        )}
        config={{ ghost: { highlight: false } }}
        variant={variant}
        {...restProps}
      >
        <props.icon size={28} />
      </Button>
    </Pane>
  );
};
