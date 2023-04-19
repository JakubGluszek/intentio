import React from "react";

import { Card, Checkbox } from "@/ui";

export interface CheckboxCardProps {
  label: string;
  value: boolean;
  onChange: (checked: boolean) => void;
}

export const CheckboxCard: React.FC<CheckboxCardProps> = (props) => {
  return (
    <Card className="flex flex-row items-center">
      <label className="w-full" htmlFor={props.label}>
        {props.label}
      </label>
      <Checkbox
        id={props.label}
        value={props.value}
        onChange={(value) => props.onChange(value)}
      />
    </Card>
  );
};
