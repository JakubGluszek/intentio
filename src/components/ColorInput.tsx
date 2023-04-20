import React from "react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";

import { ThemeForCreate } from "@/bindings/ThemeForCreate";

interface Props {
  label: string;
  type: "window_hex" | "primary_hex" | "base_hex" | "text_hex";
  watch: UseFormWatch<ThemeForCreate>;
  register: UseFormRegister<ThemeForCreate>;
  onViewColorPicker: () => void;
}

const ColorInput: React.FC<Props> = (props) => {
  const currentHex = props.watch(props.type);

  return (
    <div className="flex flex-row items-center gap-2">
      <label
        className="min-w-[80px] text-text font-semibold"
        htmlFor={props.type}
      >
        {props.label}
      </label>
      <div
        data-tauri-disable-drag
        onClick={() => props.onViewColorPicker()}
        style={{ backgroundColor: currentHex }}
        className="w-full h-8 opacity-80 hover:opacity-100 flex flex-row items-center justify-center border-2 border-base/30 shadow-lg shadow-black/30 hover:shadow-black/60 transition-all rounded cursor-pointer"
      >
        <div className="contrast-text font-bold">{currentHex}</div>
      </div>
    </div>
  );
};

export default ColorInput;
