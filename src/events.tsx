import React from "react";
import { listen } from "@tauri-apps/api/event";

import { Project } from "./bindings/Project";
import { ipc_invoke } from "./ipc";
import useGlobal from "./store";
import { applyTheme } from "./utils";
import { Theme } from "./bindings/Theme";
import { Settings } from "./bindings/Settings";

const useEvents = () => {
  const setCurrentTheme = useGlobal((state) => state.setCurrentTheme);
  const setSettings = useGlobal((state) => state.setSettings);
  const setCurrentProject = useGlobal((state) => state.setCurrentProject);

  React.useEffect(() => {
    const unlisten = listen<string>("update_current_theme", (event) => {
      applyTheme(JSON.parse(event.payload));
    });

    return () => unlisten.then((f) => f()) as never;
  }, []);

  React.useEffect(() => {
    const unlisten = listen<Settings>("settings_updated", (event) => {
      setSettings(event.payload);
    });

    return () => unlisten.then((f) => f()) as never;
  }, []);

  React.useEffect(() => {
    const unlisten = listen("current_project_updated", () => {
      ipc_invoke<Project>("get_current_project")
        .then((res) => setCurrentProject(res.data))
        .catch(() => setCurrentProject(undefined));
    });

    return () => unlisten.then((f) => f()) as never;
  }, []);

  React.useEffect(() => {
    const unlisten = listen("current_theme_updated", () => {
      ipc_invoke<Theme>("get_current_theme").then((res) => {
        applyTheme(res.data);
        setCurrentTheme(res.data);
      });
    });

    return () => unlisten.then((f) => f()) as never;
  }, []);

  return;
};

export default useEvents;
