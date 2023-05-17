import React from "react";
import { MdColorLens } from "react-icons/md";

import { Card, Tooltip } from "@/ui";
import { ThemeState } from "@/types";
import { Theme } from "@/bindings/Theme";

interface SelectedThemeProps {
  state: ThemeState;
  data: Theme;
  onChangeTheme: (state: ThemeState) => void;
}

export const SelectedTheme: React.FC<SelectedThemeProps> = (props) => {
  return (
    <Tooltip label="Click to change" position="top-start">
      <Card
        className="p-0.5 cursor-pointer"
        onClick={() => props.onChangeTheme(props.state)}
        data-tauri-disable-drag
      >
        <div
          className="flex flex-row items-center justify-between p-1 rounded-sm font-bold"
          style={{
            backgroundColor: props.data.window_hex,
            color: props.data.primary_hex,
          }}
        >
          <div className="flex flex-row items-center gap-1">
            <MdColorLens size={20} />
            {props.state}
          </div>
          <button
            className="w-fit"
            style={{
              color: props.data.base_hex,
            }}
          >
            {props.data.name}
          </button>
        </div>
      </Card>
    </Tooltip>
  );
};
