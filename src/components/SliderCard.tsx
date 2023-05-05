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
      ? utils.formatTimer(props.digit * 60)
      : props.digit;

  return (
    <Card className="flex flex-col gap-2 p-2" withBorder>
      <div className="flex flex-row items-center justify-between">
        <div className="text-text">{props.label}</div>
        <div className="w-16 border-2 border-primary/20 rounded-sm py-0.5">
          <div className="text-center text-text/80 text-sm">{content}</div>
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
