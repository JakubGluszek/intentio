import React from "react";
import { Slider as SliderMantine } from "@mantine/core";

export interface SliderProps {
  min?: number;
  max?: number;
  defaultValue?: number;
  onChangeEnd?: (minutes: number) => void;
  disabled?: boolean;
}

export const Slider: React.FC<SliderProps> = (props) => {
  React.useEffect(() => {
    const thumbs = document.querySelectorAll(".mantine-6xjpl8");
    // @ts-ignore
    thumbs.forEach((thumb) => (thumb.tabIndex = -2));
  }, []);

  return (
    <SliderMantine
      data-tauri-disable-drag
      disabled={props.disabled}
      classNames={{
        root: "w-full",
        bar: "bg-primary/60",
        thumb: "bg-primary border-primary",
        track: "before:bg-primary/20",
        label:
          "bg-window text-primary/80 font-bold shadow-lg shadow-black/30 border-2 px-3 -translate-y-2 border-base/60",
      }}
      showLabelOnHover={false}
      onChangeEnd={props.onChangeEnd}
      min={props.min}
      max={props.max}
      defaultValue={props.defaultValue}
    />
  );
};
