import React from "react";
import { UseFormRegister, UseFormWatch } from "react-hook-form";

import { ThemeFormData } from "@/types";

interface Props {
  register: UseFormRegister<ThemeFormData>;
  watch: UseFormWatch<ThemeFormData>;
}

const ThemeFormInputs: React.FC<Props> = ({ register, watch }) => {
  return (
    <>
      <div className="flex flex-row items-center gap-4">
        <label className="min-w-[64px]" htmlFor="color-scheme-name">
          Name
        </label>
        <input
          {...register("name", { required: true, maxLength: 16 })}
          id="color-scheme-name"
          className="input"
          style={{ borderColor: watch("base_hex") }}
          type="text"
        />
      </div>
      <div className="flex flex-row items-center gap-4">
        <label className="min-w-[64px]" htmlFor="window-hex">
          Window
        </label>
        <input
          {...register("window_hex", {
            required: true,
            pattern: /^#([0-9a-f]{3}){1,2}$/i,
          })}
          id="window-hex"
          style={{ borderColor: watch("base_hex") }}
          className="input"
          type="text"
        />
        <div
          style={{ backgroundColor: watch("window_hex") }}
          className="min-w-[40px] h-8 shadow-lg rounded"
        ></div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <label className="min-w-[64px]" htmlFor="base-hex">
          Base
        </label>
        <input
          {...register("base_hex", {
            required: true,
            pattern: /^#([0-9a-f]{3}){1,2}$/i,
          })}
          id="base-hex"
          style={{ borderColor: watch("base_hex") }}
          className="input"
          type="text"
        />
        <div
          style={{ backgroundColor: watch("base_hex") }}
          className="min-w-[40px] h-8 shadow-lg rounded"
        ></div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <label className="min-w-[64px]" htmlFor="primary-hex">
          Primary
        </label>
        <input
          {...register("primary_hex", {
            required: true,
            pattern: /^#([0-9a-f]{3}){1,2}$/i,
          })}
          id="primary-hex"
          style={{ borderColor: watch("base_hex") }}
          className="input"
          type="text"
        />
        <div
          style={{ backgroundColor: watch("primary_hex") }}
          className="min-w-[40px] h-8 shadow-lg rounded"
        ></div>
      </div>
      <div className="flex flex-row items-center gap-4">
        <label className="min-w-[64px]" htmlFor="text-hex">
          Text
        </label>
        <input
          {...register("text_hex", {
            required: true,
            pattern: /^#([0-9a-f]{3}){1,2}$/i,
          })}
          id="text-hex"
          style={{ borderColor: watch("base_hex") }}
          className="input"
          type="text"
        />
        <div
          style={{ backgroundColor: watch("text_hex") }}
          className="min-w-[40px] h-8 shadow-lg rounded"
        ></div>
      </div>
    </>
  );
};

export default ThemeFormInputs;
