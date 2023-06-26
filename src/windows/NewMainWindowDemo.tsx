import React from "react";
import {
  MdAddCircle,
  MdAnalytics,
  MdCheckBox,
  MdClose,
  MdHistory,
  MdInfo,
  MdRemove,
  MdSettings,
  MdTag,
  MdTimer,
} from "react-icons/md";
import { HiArchive, HiViewList } from "react-icons/hi";
import { BiTargetLock } from "react-icons/bi";
import { useHotkeys } from "@mantine/hooks";
import { clsx } from "@mantine/core";
import { appWindow, LogicalSize } from "@tauri-apps/api/window";

import { WindowContainer } from "@/components";
import { Button } from "@/ui";

const NewMainWindowDemo: React.FC = () => {
  const [fontSize, setFontSize] = React.useState(18);

  const windowRef = React.useRef<HTMLDivElement>(null);

  const iconSize = fontSize + fontSize * 0.25;

  const updateSize = () => {
    if (!windowRef.current) return;
    let root = document.querySelector(":root");
    // @ts-ignore
    root.style.fontSize = `${fontSize}px`;
    const width = windowRef.current.clientWidth;
    const height = windowRef.current.clientHeight;
    const size = new LogicalSize(width, height);
    appWindow.setMinSize(size);
    appWindow.setMaxSize(size);
    appWindow.setSize(size);
  };

  React.useEffect(() => {
    updateSize();
  }, []);

  React.useEffect(() => {
    updateSize();
  }, [fontSize]);

  useHotkeys([
    ["ctrl+=", () => setFontSize((prev) => prev + 1)],
    ["ctrl+-", () => setFontSize((prev) => prev - 1)],
    ["ctrl+0", () => setFontSize(16)],
  ]);

  return (
    <WindowContainer>
      <div ref={windowRef} className="w-[20rem] h-[21rem]">
        <div className="w-screen h-screen flex flex-col bg-window/95 border-2 border-base/10 rounded-md overflow-clip">
          {/* Titlebar */}
          <div className="flex flex-row items-center h-8 p-0.5 bg-base/10">
            <div className="flex flex-row">
              <Button variant="ghost">
                <MdSettings size={iconSize} />
              </Button>
              <Button variant="ghost">
                <MdAnalytics size={iconSize} />
              </Button>
            </div>
            <div className="w-full text-center font-bold text-lg text-text/80">
              Intentio
            </div>
            <div className="flex flex-row">
              <Button variant="ghost">
                <MdRemove size={iconSize} />
              </Button>
              <Button variant="ghost">
                <MdClose size={iconSize} />
              </Button>
            </div>
          </div>

          <div className="relative grow flex flex-col p-0.5">
            <div className="grow flex flex-col gap-0.5">
              <div className="h-8 flex flex-row gap-0.5 rounded-[1px] overflow-clip">
                {/* Heading Label */}
                <div className="flex-1 flex flex-row items-center gap-1 px-2 text-text/60 bg-base/5">
                  <MdInfo size={iconSize} />
                  <span className="font-bold uppercase text-lg">Intents</span>
                </div>
                {/* Intents Button Bar */}
                <div className="w-fit flex flex-row items-center px-2 gap-2 bg-base/5 hover:bg-primary/10 hover:shadow-black/40 hover:shadow-lg transition-all duration-150">
                  <Button
                    variant="ghost"
                    config={{ ghost: { highlight: false } }}
                  >
                    <MdAddCircle size={iconSize} />
                  </Button>
                  <Button
                    variant="ghost"
                    config={{ ghost: { highlight: false } }}
                  >
                    <MdTag size={iconSize} />
                  </Button>
                  <Button
                    variant="ghost"
                    config={{ ghost: { highlight: false } }}
                  >
                    <HiArchive size={iconSize} />
                  </Button>
                </div>
              </div>
              {/* Intents List */}
              <div className="grow flex flex-col bg-base/5 p-1 gap-1 rounded-[1px] transition-all duration-150">
                <button className="h-fit flex flex-col gap-0.5 p-1 hover:bg-primary/20 bg-base/5 border border-base/10 active:bg-primary/30 active:border-transparent rounded-sm transition-all duration-300 hover:shadow-black/25 hover:shadow active:shadow-black/25 active:shadow-lg">
                  <div className="flex flex-row items-center gap-1 text-text/80">
                    <BiTargetLock size={iconSize} />
                    <span className="font-bold">Intent 1</span>
                  </div>
                  <div className="w-full flex flex-row gap-0.5 p-0.5 bg-window/50 rounded-md">
                    <div className="flex flex-row items-center px-1 rounded bg-primary/20 hover:bg-primary/30 text-primary/80 hover:text-primary active:bg-primary active:text-window transition-all duration-150">
                      <MdTag size={iconSize} />
                      <span className="uppercase text-sm font-bold">
                        Coding
                      </span>
                    </div>
                    <div className="flex flex-row items-center px-1 rounded bg-primary/20 hover:bg-primary/30 text-primary/80 hover:text-primary active:bg-primary active:text-window transition-all duration-150">
                      <MdTag size={iconSize} />
                      <span className="uppercase text-sm font-bold">
                        Another One
                      </span>
                    </div>
                  </div>
                </button>
                <button className="h-8 flex flex-row p-1 hover:bg-primary/20 bg-base/5 border border-base/10 active:bg-primary/30 active:border-transparent rounded-sm transition-all duration-300 hover:shadow-black/25 hover:shadow active:shadow-black/25 active:shadow-lg">
                  <div className="flex flex-row items-center gap-1 text-text/80">
                    <BiTargetLock size={iconSize} />
                    <span className="font-bold">Intent 2</span>
                  </div>
                </button>
                <button className="h-8 flex flex-row p-1 hover:bg-primary/20 bg-base/5 border border-base/10 active:bg-primary/30 active:border-transparent rounded-sm transition-all duration-300 hover:shadow-black/25 hover:shadow active:shadow-black/25 active:shadow-lg">
                  <div className="flex flex-row items-center gap-1 text-text/80">
                    <BiTargetLock size={iconSize} />
                    <span className="font-bold">Intent 3</span>
                  </div>
                </button>
              </div>

              {/* Intent Panels */}
              <div className="h-7 flex flex-row rounded-[1px]">
                <PanelButton>
                  <HiViewList size={iconSize} />
                </PanelButton>
                <PanelButton>
                  <MdCheckBox size={iconSize} />
                </PanelButton>
                <PanelButton>
                  <MdTimer size={iconSize} />
                </PanelButton>
                <PanelButton>
                  <MdHistory size={iconSize} />
                </PanelButton>
                <PanelButton isSelected>
                  <BiTargetLock size={iconSize} />
                </PanelButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WindowContainer>
  );
};

interface PanelButtonProps {
  children: React.ReactNode;
  isSelected?: boolean;
}

const PanelButton: React.FC<PanelButtonProps> = ({ children, isSelected }) => {
  return (
    <button
      className={clsx(
        "flex-1 flex flex-row items-center justify-center hover:shadow-black/10 hover:shadow active:shadow-black/20 active:shadow-lg active:scale-95 transition-all duration-150 first:rounded-bl last:rounded-br",
        isSelected
          ? "bg-primary/20 hover:bg-primary/30 text-primary border-b-2 border-primary"
          : "bg-base/5 hover:bg-base/10 text-text/80 hover:text-base active:text-primary"
      )}
    >
      {children}
    </button>
  );
};

export default NewMainWindowDemo;
