import React from "react";
import { Slider as SliderMantine } from "@mantine/core";

interface Props {
  min?: number;
  max?: number;
  defaultValue?: number;
  onChangeEnd?: (minutes: number) => void;
}

const Slider: React.FC<Props> = ({ min, max, defaultValue, onChangeEnd }) => {
  return (
    <SliderMantine
      classNames={{
        root: "w-full",
        bar: "bg-primary",
        thumb: "bg-primary border-primary",
        track: "before:bg-base",
        label: "bg-base text-text",
      }}
      showLabelOnHover={false}
      onChangeEnd={onChangeEnd}
      min={min}
      max={max}
      defaultValue={defaultValue && defaultValue / 60}
    />
  );
};

export default Slider;
