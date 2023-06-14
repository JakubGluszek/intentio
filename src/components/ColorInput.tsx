import React from "react";
import { MdColorLens } from "react-icons/md";

import { Card } from "@/ui";

interface ColorInputProps {
  label: string;
  hex: string;
  onViewColorPicker: () => void;
}

export const ColorInput: React.FC<ColorInputProps> = (props) => {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex flex-row items-center gap-1.5 text-text font-semibold">
        <MdColorLens size={20} />
        <div>{props.label}</div>
      </div>
      <div
        onClick={() => props.onViewColorPicker()}
        style={{ backgroundColor: props.hex }}
        className="w-full p-1 opacity-80 uppercase hover:opacity-100 flex flex-row items-center justify-center hover:shadow hover:shadow-black/20 transition-all rounded cursor-pointer"
        data-tauri-disable-drag
      >
        <div className="contrast-text font-bold">{props.hex}</div>
      </div>
    </Card>
  );
};
