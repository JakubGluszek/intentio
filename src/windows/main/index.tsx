import React from "react";
import { MdSettings, MdRemove, MdClose } from "react-icons/md";
import { TbLayoutSidebarRightCollapse } from "react-icons/tb";
import { appWindow, WebviewWindow } from "@tauri-apps/api/window";
import { exit } from "@tauri-apps/api/process";
import { toast } from "react-hot-toast";

import app from "@/app";
import { useEvent } from "@/hooks";
import services from "@/app/services";
import Layout from "@/components/Layout";
import Button from "@/components/Button";
import Timer from "./timer";
import Sidebar from "./Sidebar";

const MainWindow: React.FC = () => {
  const [viewSidebar, setViewSidebar] = React.useState(false);

  const store = app.useStore();

  useEvent("active_intent_id_updated", (event) => {
    store.setActiveIntentId(event.payload.active_intent_id);
  });
  useEvent("intent_created", (event) => store.addIntent(event.payload));
  useEvent("intent_updated", (event) =>
    store.patchIntent(event.payload.id, event.payload)
  );
  useEvent("intent_deleted", (event) => store.removeIntent(event.payload.id));
  useEvent("intent_archived", (event) => {
    if (store.activeIntentId === event.payload.id) {
      services.setActiveIntentId(undefined).then((data) => {
        store.setActiveIntentId(data);
        toast("Active intent has been archived");
      });
    }

    store.patchIntent(event.payload.id, event.payload);
  });
  useEvent("intent_unarchived", (event) =>
    store.patchIntent(event.payload.id, event.payload)
  );

  React.useEffect(() => {
    services.getIntents().then((data) => store.setIntents(data));
    services.getActiveIntentId().then((data) => store.setActiveIntentId(data));
  }, []);

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
          {store.settings && store.currentTheme ? (
            <Timer
              settings={store.settings}
              theme={store.currentTheme}
              activeIntent={store.getActiveIntent()}
            />
          ) : null}
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
          <TbLayoutSidebarRightCollapse size={28} />
        </Button>
        <div
          className="transition-opacity duration-400"
          style={{ opacity: props.sidebarVisibility ? 0.0 : 1.0 }}
        >
          <Button
            transparent
            onClick={() =>
              new WebviewWindow("settings", app.config.webviews.settings)
            }
          >
            <MdSettings size={28} />
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
        <div
          className="transition-opacity duration-300"
          style={{ opacity: props.sidebarVisibility ? 0.0 : 1.0 }}
        >
          <Button transparent onClick={() => appWindow.hide()}>
            <MdRemove size={28} />
          </Button>
        </div>
        <Button transparent onClick={() => exit(1)}>
          <MdClose size={28} />
        </Button>
      </div>
    </div>
  );
};

export default MainWindow;
