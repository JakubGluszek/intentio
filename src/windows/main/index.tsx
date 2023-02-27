import React from "react";
import { MdSettings, MdRemove, MdClose } from "react-icons/md";
import { TbLayoutSidebarRightCollapse } from "react-icons/tb";
import { WebviewWindow } from "@tauri-apps/api/window";

import ipc from "@/ipc";
import useStore from "@/store";
import config from "@/config";
import { Layout, Button } from "@/components";
import Timer from "./timer";
import Sidebar from "./sidebar";

const MainWindow: React.FC = () => {
  const [viewSidebar, setViewSidebar] = React.useState(false);

  const store = useStore();

  return (
    <Layout>
      {/* Window Titlebar */}
      <div className="flex flex-row items-center justify-between p-2">
        <div className="flex flex-row items-center gap-2">
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
        <div className="flex flex-row items-center gap-2">
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
      <div className="grow flex flex-col p-2">
        {store.settings && store.currentTheme && (
          <Timer
            settings={store.settings}
            theme={store.currentTheme}
            activeIntent={store.getActiveIntent()}
          />
        )}
      </div>

      <Sidebar
        isVisible={viewSidebar}
        toggle={() => setViewSidebar((view) => !view)}
      />
    </Layout>
  );
};

export default MainWindow;
