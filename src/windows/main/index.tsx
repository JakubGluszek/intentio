import React from "react";
import { MdSettings, MdRemove, MdClose, MdSkipNext } from "react-icons/md";
import { TbLayoutSidebarRightCollapse } from "react-icons/tb";
import toast from "react-hot-toast";
import { appWindow, WebviewWindow } from "@tauri-apps/api/window";
import { exit } from "@tauri-apps/api/process";

import Layout from "@/components/Layout";
import Button from "@/components/Button";
import Timer from "./timer";
import Sidebar from "./Sidebar";
import { useStore } from "@/app/store";
import { CONFIG } from "@/app/config";

const MainWindow: React.FC = () => {
  const settings = useStore((state) => state.settings);
  const state = useStore((state) => state.state);

  const [viewSidebar, setViewSidebar] = React.useState(false);
  // neat little trick to call function defined in child component
  const biRef: { nextFunc?: (manual?: boolean) => void | undefined } = {};

  return (
    <React.Fragment>
      <Layout
        header={
          <Header
            sidebarVisibility={viewSidebar}
            expandSidebar={() => setViewSidebar(true)}
          />
        }
      >
        <div
          className="grow flex flex-col p-2 transition-opacity duration-300"
          style={{
            opacity: viewSidebar ? 0.0 : 1.0,
          }}
        >
          {settings && state?.session_queue !== undefined && (
            <Timer biRef={biRef} settings={settings} state={state} />
          )}
          <div className="flex flex-row items-center justify-between">
            <span className="text-primary/80 font-bold w-8 text-center text-lg">
              #0
            </span>
            <span className="text-text/80 text-lg">intent</span>
            <Button
              transparent
              onClick={() => {
                biRef.nextFunc && biRef.nextFunc(true);
                toast("Session skipped", {
                  position: "top-center",
                  duration: 1200,
                });
              }}
            >
              <MdSkipNext size={32} />
            </Button>
          </div>
        </div>
      </Layout>

      <Sidebar isVisible={viewSidebar} collapse={() => setViewSidebar(false)} />
    </React.Fragment>
  );
};

interface HeaderProps {
  sidebarVisibility: boolean;
  expandSidebar: () => void;
}

const Header: React.FC<HeaderProps> = (props) => {
  return (
    <div className="flex flex-row items-center justify-between p-2">
      <div className="flex flex-row items-center gap-2">
        <Button transparent onClick={props.expandSidebar}>
          <TbLayoutSidebarRightCollapse size={32} />
        </Button>
        <div
          className="transition-opacity duration-400"
          style={{ opacity: props.sidebarVisibility ? 0.0 : 1.0 }}
        >
          <Button
            transparent
            onClick={() =>
              new WebviewWindow("settings", CONFIG.webviews.settings)
            }
          >
            <MdSettings size={32} />
          </Button>
        </div>
      </div>
      <h1
        className="text-text/80 font-bold transition-opacity duration-300"
        style={{ opacity: props.sidebarVisibility ? 0.0 : 1.0 }}
      >
        Intentio
      </h1>
      <div className="flex flex-row items-center gap-2">
        <Button transparent onClick={() => appWindow.hide()}>
          <MdRemove size={32} />
        </Button>
        <Button transparent onClick={() => exit(1)}>
          <MdClose size={32} />
        </Button>
      </div>
    </div>
  );
};

export default MainWindow;
