import React from "react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";

import { ThemeForCreate } from "@/bindings/ThemeForCreate";
import { Card } from "@/ui";
import { MdColorLens } from "react-icons/md";

interface ColorInputProps {
  label: string;
  type: "window_hex" | "primary_hex" | "base_hex" | "text_hex";
  watch: UseFormWatch<ThemeForCreate>;
  register: UseFormRegister<ThemeForCreate>;
  onViewColorPicker: () => void;
}

export const ColorInput: React.FC<ColorInputProps> = (props) => {
  const currentHex = props.watch(props.type);

  return (
    <Card className="flex flex-col gap-2">
      <div
        className="flex flex-row items-center gap-1.5 text-text font-semibold"
      >
        <MdColorLens size={20} />
        <div>{props.label}</div>
      </div>
      <div
        onClick={() => props.onViewColorPicker()}
        style={{ backgroundColor: currentHex }}
        className="w-full p-1 opacity-80 uppercase hover:opacity-100 flex flex-row items-center justify-center shadow shadow-black/30 hover:shadow-lg hover:shadow-black/30 transition-all rounded cursor-pointer"
        data-tauri-disable-drag
      >
        <div className="contrast-text font-bold">{currentHex}</div>
      </div>
    </Card>
  );
};