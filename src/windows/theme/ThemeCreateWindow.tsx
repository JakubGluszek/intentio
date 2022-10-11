import React from "react";
import { appWindow } from "@tauri-apps/api/window";
import { invoke } from "@tauri-apps/api/tauri";
import { MdClose, MdColorLens } from "react-icons/md";

import WindowBorders from "../../components/WindowBorders";
import { Colors, Settings } from "../../types";

const ThemeCreateWindow: React.FC = () => {
  const [settings, setSettings] = React.useState<Settings>();
  const [name, setName] = React.useState("");
  const [colors, setColors] = React.useState<Colors>();

  React.useEffect(() => {
    invoke<Settings>("settings_read").then((s) => {
      setColors(s.theme.current.colors);
      setSettings(s);
    });
  }, []);

  if (!settings || !colors) return null;

  return (
    <>
      <WindowBorders />
      <div className="w-screen h-screen flex flex-col gap-2 p-4">
        {/* Window Header */}
        <div className="h-10 flex flex-row items-center justify-between p-1">
          <div className="flex flex-row items-center gap-2 text-text">
            <MdColorLens size={32} />
            <span>Custom Theme</span>
          </div>
          <button className="btn btn-ghost" onClick={() => appWindow.close()}>
            <MdClose size={32} />
          </button>
        </div>
        {/* Window Content */}
        <div className="grow flex flex-col gap-4 p-1">
          <div className="flex flex-row items-center gap-4 p-2 rounded hover:bg-base">
            <span>Name</span>
            <input
              className="input"
              type="text"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              minLength={1}
              maxLength={16}
            />
          </div>
          <div className="grow grid grid-cols-2 grid-rows-2 gap-1 text-sm">
            <div className="group flex flex-col items-center gap-1 p-1 rounded hover:bg-base">
              <div
                style={{
                  backgroundColor: colors.window,
                }}
                className="w-full h-full rounded flex flex-col items-center justify-center"
              >
                <span className="contrast-text">{colors.window}</span>
              </div>
              <span>Window</span>
            </div>
            <div className="group flex flex-col items-center gap-1 p-1 rounded hover:bg-base">
              <div
                style={{ backgroundColor: colors.base }}
                className="w-full h-full rounded flex flex-col items-center justify-center"
              >
                <span className="contrast-text">{colors.base}</span>
              </div>
              <span>Base</span>
            </div>
            <div className="group flex flex-col items-center gap-1 p-1 rounded hover:bg-base">
              <div
                style={{ backgroundColor: colors.primary }}
                className="w-full h-full rounded flex flex-col items-center justify-center"
              >
                <span className="contrast-text">{colors.primary}</span>
              </div>
              <span>Primary</span>
            </div>
            <div className="group flex flex-col items-center gap-1 p-1 rounded hover:bg-base">
              <div
                style={{ backgroundColor: colors.text }}
                className="w-full h-full rounded flex flex-col items-center justify-center"
              >
                <span className="contrast-text">{colors.text}</span>
              </div>
              <span>Text</span>
            </div>
          </div>
          <div className="flex flex-row items-center gap-4 justify-center">
            <button className="btn btn-primary h-10 w-full">Save</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThemeCreateWindow;
