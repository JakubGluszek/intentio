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
    const sessionSavedEvent = listen<Session>("session_saved", (event) =>
      addSession(event.payload)
    );
    const deactivateQueueEvent = listen("deactivate_queue", () => {
      setActiveQueue(null);
    });
    const setActiveQueueEvent = listen<ActiveQueue | null>(
      "set_active_queue",
      (event) => setActiveQueue(event.payload)
    );
    const projectCreatedEvent = listen<Project>("project_created", (event) => {
      addProject(event.payload);
    });

    const projectDeletedEvent = listen<ModelDeleteResultData>(
      "project_deleted",
      (event) => {
        removeProject(event.payload.id);
      }
    );
    const updateCurrentThemeEvent = listen<string>(
      "update_current_theme",
      (event) => {
        applyTheme(JSON.parse(event.payload));
      }
    );
    const settingsUpdatedEvent = listen<Settings>(
      "settings_updated",
      (event) => {
        setSettings(event.payload);
      }
    );
    const currentProjectUpdatedEvent = listen("current_project_updated", () => {
      ipc_invoke<Project>("get_current_project")
        .then((res) => setCurrentProject(res.data))
        .catch(() => setCurrentProject(undefined));
    });
    const currentThemeUpdatedEvent = listen("current_theme_updated", () => {
      ipc_invoke<Theme>("get_current_theme").then((res) => {
        applyTheme(res.data);
        setCurrentTheme(res.data);
      });
    });

    return () =>
      Promise.all([
        sessionSavedEvent,
        deactivateQueueEvent,
        setActiveQueueEvent,
        projectCreatedEvent,
        projectDeletedEvent,
        updateCurrentThemeEvent,
        settingsUpdatedEvent,
        currentProjectUpdatedEvent,
        currentThemeUpdatedEvent,
      ]).then((values) => values.forEach((v) => v())) as never;
  }, []);
};

export default useEvents;
