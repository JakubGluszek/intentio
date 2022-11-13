import React from "react";
import { listen } from "@tauri-apps/api/event";

import { Project } from "./bindings/Project";
import { ipc_invoke } from "./ipc";
import useGlobal from "./store";
import { applyTheme } from "./utils";
import { Theme } from "./bindings/Theme";
import { Settings } from "./bindings/Settings";
import { ModelDeleteResultData } from "./bindings/ModelDeleteResultData";
import { ActiveQueue } from "./bindings/ActiveQueue";
import { Session } from "./bindings/Session";

const useEvents = () => {
  const setCurrentTheme = useGlobal((state) => state.setCurrentTheme);
  const setSettings = useGlobal((state) => state.setSettings);
  const setCurrentProject = useGlobal((state) => state.setCurrentProject);
  const addProject = useGlobal((state) => state.addProject);
  const removeProject = useGlobal((state) => state.removeProject);
  const setActiveQueue = useGlobal((state) => state.setActiveQueue);
  const addSession = useGlobal((state) => state.addSession);

  React.useEffect(() => {
    const unlisten = listen<Session>("session_saved", (event) =>
      addSession(event.payload)
    );

    return () => unlisten.then((f) => f()) as never;
  }, []);

  React.useEffect(() => {
    const unlisten = listen("deactivate_queue", () => {
      setActiveQueue(null);
    });

    return () => unlisten.then((f) => f()) as never;
  }, []);

  React.useEffect(() => {
    const unlisten = listen<ActiveQueue | null>("set_active_queue", (event) =>
      setActiveQueue(event.payload)
    );

    return () => unlisten.then((f) => f()) as never;
  }, []);

  React.useEffect(() => {
    const unlisten = listen<Project>("project_created", (event) => {
      addProject(event.payload);
    });

    return () => unlisten.then((f) => f()) as never;
  }, []);

  React.useEffect(() => {
    const unlisten = listen<ModelDeleteResultData>(
      "project_deleted",
      (event) => {
        removeProject(event.payload.id);
      }
    );

    return () => unlisten.then((f) => f()) as never;
  }, []);

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
