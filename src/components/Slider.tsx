import React from "react";
import { Slider as SliderMantine } from "@mantine/core";

interface Props {
  min?: number;
  max?: number;
  defaultValue?: number;
  onChangeEnd?: (minutes: number) => void;
  disabled?: boolean;
}

const Slider: React.FC<Props> = ({
  min,
  max,
  defaultValue,
  onChangeEnd,
  disabled,
}) => {
  React.useEffect(() => {
    const thumbs = document.querySelectorAll(".mantine-6xjpl8");
    // @ts-ignore
    thumbs.forEach((thumb) => (thumb.tabIndex = -2));
  }, []);

  return (
    <SliderMantine
      data-tauri-disable-drag
      disabled={disabled}
      classNames={{
        root: "w-full",
        bar: "bg-primary",
        thumb: "bg-primary border-primary",
        track: "before:bg-base",
        label:
          "bg-base text-text shadow border-2 px-2 -translate-y-2 border-primary",
      }}
      showLabelOnHover={false}
      onChangeEnd={onChangeEnd}
      min={min}
      max={max}
      defaultValue={defaultValue}
    />
  );
};

export default Slider;
