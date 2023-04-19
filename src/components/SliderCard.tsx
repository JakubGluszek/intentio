import React from "react";

import { Card, Slider } from "@/ui";
import utils from "@/utils";

export interface SliderCardProps {
  type: "duration" | "iterations";
  label: string;
  digit: number;
  minDigit: number;
  maxDigit: number;
  onChange: (minutes: number) => void;
}

export const SliderCard: React.FC<SliderCardProps> = (props) => {
  const content =
    props.type === "duration"
      ? utils.formatTimeTimer(props.digit * 60)
      : props.digit;

  return (
    <Card className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-between">
        <span className="font-medium">{props.label}</span>
        <div className="w-16 bg-window border-2 border-base/40 rounded-sm py-0.5">
          <div className="text-sm text-center">{content}</div>
        </div>
      </div>
      <Slider
        min={props.minDigit}
        max={props.maxDigit}
        defaultValue={props.digit}
        onChangeEnd={(value) => props.onChange(value)}
      />
    </Card>
  );
};
