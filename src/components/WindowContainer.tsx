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
  });

  React.useEffect(() => {
    ipc.getCurrentTheme().then((data) => {
      utils.applyTheme(data);
      store.setCurrentTheme(data);
    });
  }, []);

  return <Layout>{props.children}</Layout>;
};

export default WindowContainer;
