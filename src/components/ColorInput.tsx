import React from "react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";

import { ThemeForCreate } from "@/bindings/ThemeForCreate";
import { Card } from "@/ui";
import { MdColorLens } from "react-icons/md";

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
    <Card className="flex flex-col gap-1">
      <label
        className="min-w-[80px] flex flex-row items-center gap-1 text-text font-semibold"
        htmlFor={props.type}
      >
        <MdColorLens size={20} />
        <div>{props.label}</div>
      </label>
      <div
        data-tauri-disable-drag
        onClick={() => props.onViewColorPicker()}
        style={{ backgroundColor: currentHex }}
        className="w-full p-1 opacity-80 hover:opacity-100 flex flex-row items-center justify-center shadow shadow-black/30 hover:shadow-lg hover:shadow-black/30 transition-all rounded cursor-pointer"
      >
        <div className="contrast-text font-bold">{currentHex}</div>
      </div>
    </Card>
  );
};

export default ColorInput;
