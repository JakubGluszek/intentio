import React from "react";
import { MdSettings, MdRemove, MdClose } from "react-icons/md";
import { TbLayoutSidebarRightCollapse } from "react-icons/tb";
import { appWindow, LogicalSize, WebviewWindow } from "@tauri-apps/api/window";

import ipc from "@/ipc";
import useStore from "@/store";
import config from "@/config";
import { Button } from "@/components";
import Sidebar from "./sidebar";
import TimerView from "./timer";
import WindowContainer from "@/components/WindowContainer";

const MainWindow: React.FC = () => {
  const [viewSidebar, setViewSidebar] = React.useState(false);
  const [miniMode, setMiniMode] = React.useState(false);

  const store = useStore();

  const minimize = () => {
    appWindow.setResizable(true);
    let size = new LogicalSize(config.webviews.main.width, 122);
    appWindow.setSize(size);
    appWindow.setMaxSize(size);
    appWindow.setMinSize(size);
    setViewSidebar(false);
    setMiniMode(true);
  };

  const maximize = () => {
    let size = new LogicalSize(
      config.webviews.main.width,
      config.webviews.main.height
    );
    appWindow.setSize(size);
    appWindow.setMinSize(size);
    appWindow.setMaxSize(size);
    setMiniMode(false);
  };

  return (
    <WindowContainer>
      {/* Window Titlebar */}
      <div className="grow flex flex-col bg-window/80">
        <div className="flex flex-row items-center justify-between p-1.5 bg-window border-2 border-darker/20 border-b-0">
          <div className="flex flex-row items-center gap-1">
            <Button
              transparent
              onClick={() => {
                miniMode && maximize();
                setViewSidebar(true);
              }}
            >
              <TbLayoutSidebarRightCollapse size={28} />
            </Button>
            <div>
              <Button
                transparent
                onClick={() =>
                  new WebviewWindow("settings", config.webviews.settings)
                }
              >
                <MdSettings size={28} />
              </Button>
            </div>
          </div>
          <h1 className="text-text/80 font-bold">Intentio</h1>
          <div className="flex flex-row items-center gap-1">
            <div>
              <Button transparent onClick={() => ipc.hideMainWindow()}>
                <MdRemove size={28} />
              </Button>
            </div>
            <Button transparent onClick={() => ipc.exitMainWindow()}>
              <MdClose size={28} />
            </Button>
          </div>
        </div>

        {/* Window Content */}
        <div className="grow flex flex-col">
          {store.settings && store.currentTheme && (
            <TimerView
              compact={miniMode}
              toggleCompact={() => (miniMode ? maximize() : minimize())}
              settings={store.settings}
              theme={store.currentTheme}
              activeIntent={store.getActiveIntent()}
            />
          )}
        </div>
      </div>
      <Sidebar
        isVisible={viewSidebar}
        toggle={React.useCallback(
          () =>
            setViewSidebar((view) => {
              !view && maximize();
              if (miniMode) return false;
              return !view;
            }),
          [miniMode]
        )}
      />
    </WindowContainer>
  );
};

export default MainWindow;
