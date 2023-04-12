import React from "react";

import { useEvents } from "@/hooks";
import ipc from "@/ipc";
import useStore from "@/store";
import utils from "@/utils";
import Layout from "./Layout";

interface Props {
  children: React.ReactNode;
}

const WindowContainer: React.FC<Props> = (props) => {
  const store = useStore();

  useEvents({
    preview_theme: (data) => {
      utils.applyTheme(data);
    },
    current_theme_updated: (data) => {
      utils.applyTheme(data);
      store.setCurrentTheme(data);
    },
    interface_config_updated: (data) => {
      store.setInterfaceConfig(data);
    },
    theme_updated: (data) => {
      if (store.currentTheme?.id === data.id) {
        ipc.setCurrentTheme(data);
      } else if (store.getIdleTheme()?.id === data.id) {
        ipc.setIdleTheme(data);
      } else if (store.getFocusTheme()?.id === data.id) {
        ipc.setFocusTheme(data);
      } else if (store.getBreakTheme()?.id === data.id) {
        ipc.setBreakTheme(data);
      } else if (store.getLongBreakTheme()?.id === data.id) {
        ipc.setLongBreakTheme(data);
      }

      store.patchTheme(data.id, data);
    },
  });

  React.useEffect(() => {
    ipc.getInterfaceConfig().then((data) => store.setInterfaceConfig(data));
    ipc.getCurrentTheme().then((data) => {
      utils.applyTheme(data);
      store.setCurrentTheme(data);
    });
  }, []);

  return <Layout>{props.children}</Layout>;
};

export default WindowContainer;
