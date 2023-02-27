import React from "react";
import { MdSettings, MdRemove, MdClose } from "react-icons/md";
import { TbLayoutSidebarRightCollapse } from "react-icons/tb";
import { appWindow, LogicalSize, WebviewWindow } from "@tauri-apps/api/window";

import ipc from "@/ipc";
import useStore from "@/store";
import config from "@/config";
import { Layout, Button } from "@/components";
import Sidebar from "./sidebar";
import TimerView from "./timer";
import { FiMaximize, FiMinimize } from "react-icons/fi";

const MainWindow: React.FC = () => {
  const [viewSidebar, setViewSidebar] = React.useState(false);
  const [miniMode, setMiniMode] = React.useState(false);

  const store = useStore();

  React.useEffect(() => {
    if (!miniMode || viewSidebar) {
      appWindow.setResizable(true);
      let size = new LogicalSize(
        config.webviews.main.width,
        config.webviews.main.height
      );
      appWindow.setSize(size);
      appWindow.setMaxSize(size);
      appWindow.setMinSize(size);
      appWindow.setResizable(false);
    } else {
      let size = new LogicalSize(config.webviews.main.width, 122);
      appWindow.setResizable(true);
      appWindow.setSize(size);
      appWindow.setMinSize(size);
      appWindow.setMaxSize(size);
    }
  }, [miniMode, viewSidebar]);

  React.useEffect(() => {
    setMiniMode(false);
  }, [viewSidebar]);

  return (
    <Layout>
      {/* Window Titlebar */}
      <div className="grow flex flex-col bg-window/80">
        <div className="flex flex-row items-center justify-between p-1.5 bg-window border-2 border-base">
          <div className="flex flex-row items-center gap-1">
            <Button transparent onClick={() => setViewSidebar(true)}>
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
              toggleCompact={() => setMiniMode((mini) => !mini)}
              settings={store.settings}
              theme={store.currentTheme}
              activeIntent={store.getActiveIntent()}
            />
          )}
        </div>
      </div>
      <Sidebar
        isVisible={viewSidebar}
        toggle={() =>
          setViewSidebar((view) => {
            setMiniMode(false);
            return !view;
          })
        }
      />
    </Layout>
  );
};

export default MainWindow;
