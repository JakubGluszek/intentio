import React from "react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";

import { ThemeForCreate } from "@/bindings/ThemeForCreate";
import { Input } from "@/ui";

interface Props {
  label: string;
  type: "window_hex" | "primary_hex" | "base_hex" | "text_hex";
  watch: UseFormWatch<ThemeForCreate>;
  register: UseFormRegister<ThemeForCreate>;
  onViewColorPicker: () => void;
}

const ColorInput: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <label
        className="min-w-[64px] text-text/80 font-semibold"
        htmlFor={props.type}
      >
        {props.label}
      </label>
      <Input
        {...props.register(props.type, {
          required: true,
          pattern: /^#([0-9a-f]{3}){1,2}$/i,
        })}
        id="text-hex"
      />
      <div
        data-tauri-disable-drag
        onClick={() => props.onViewColorPicker()}
        style={{ backgroundColor: props.watch(props.type) }}
        className="min-w-[40px] h-8 shadow-lg rounded cursor-pointer"
      ></div>
    </div>
  );
};

export default ColorInput;
