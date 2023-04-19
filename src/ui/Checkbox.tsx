import React from "react";
import { Checkbox as CheckboxMantine } from "@mantine/core";

export interface CheckboxProps {
  id?: string;
  value: boolean;
  onChange: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = (props) => {
  return (
    <CheckboxMantine
      id={props.id}
      size="sm"
      defaultChecked={props.value}
      onChange={(value) => props.onChange(value.currentTarget.checked)}
      styles={{
        icon: { color: "rgb(var(--primary-color)) !important" },
        root: { height: "20px" },
      }}
      classNames={{
        input:
          "border-primary checked:border-primary bg-transparent checked:bg-transparent border-2",
      }}
      tabIndex={-2}
    />
  );
};
