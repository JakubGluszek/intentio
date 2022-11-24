import React from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { listen } from "@tauri-apps/api/event";

import { ipc_invoke } from "./app/ipc";
import { Theme } from "./bindings/Theme";
import { applyTheme } from "./utils";
import useGlobal from "./app/store";
import { Settings } from "./bindings/Settings";
import { Project } from "./bindings/Project";
import MainWindow from "./windows/main";
import { Session } from "./bindings/Session";
import { ActiveQueue } from "./bindings/ActiveQueue";
import { ModelDeleteResultData } from "./bindings/ModelDeleteResultData";

import.meta.env.PROD &&
  document.addEventListener("contextmenu", (event) => event.preventDefault());

const SettingsWindow = React.lazy(() => import("./windows/settings"));
const ProjectsWindow = React.lazy(() => import("./windows/projects"));
const AnalyticsWindow = React.lazy(() => import("./windows/analytics"));
const QueuesWindow = React.lazy(() => import("./windows/queues"));

const App: React.FC = () => {
  const setSettings = useGlobal((state) => state.setSettings);
  const setCurrentTheme = useGlobal((state) => state.setCurrentTheme);
  const setProjects = useGlobal((state) => state.setProjects);
  const setCurrentProject = useGlobal((state) => state.setCurrentProject);

  // IPC calls needed for each window
  React.useEffect(() => {
    ipc_invoke<Settings>("get_settings").then((res) => setSettings(res.data));
    ipc_invoke<Theme>("get_current_theme").then((res) => {
      applyTheme(res.data);
      setCurrentTheme(res.data);
    });
    ipc_invoke<Project[]>("get_projects").then((res) => setProjects(res.data));
    ipc_invoke<Project>("get_current_project")
      .then((res) => setCurrentProject(res.data))
      .catch(() => setCurrentProject(undefined));
  }, []);

  const addProject = useGlobal((state) => state.addProject);
  const removeProject = useGlobal((state) => state.removeProject);
  const setActiveQueue = useGlobal((state) => state.setActiveQueue);
  const addSession = useGlobal((state) => state.addSession);

  // Events to listen for on each window
  React.useEffect(() => {
    const onSessionSaved = listen<Session>("session_saved", (event) =>
      addSession(event.payload)
    );
    const onQueueDeactivated = listen("deactivate_queue", () => {
      setActiveQueue(null);
    });
    const onQueueActivated = listen<ActiveQueue | null>(
      "set_active_queue",
      (event) => setActiveQueue(event.payload)
    );
    const onProjectCreated = listen<Project>("project_created", (event) => {
      addProject(event.payload);
    });

    const onProjectDeleted = listen<ModelDeleteResultData>(
      "project_deleted",
      (event) => {
        removeProject(event.payload.id);
      }
    );
    const onThemePreview = listen<Theme>("preview_theme", (event) => {
      applyTheme(event.payload);
    });
    const onSettingsUpdated = listen<Settings>("settings_updated", (event) => {
      setSettings(event.payload);
    });
    const onCurrentProjectUpdated = listen("current_project_updated", () => {
      ipc_invoke<Project>("get_current_project")
        .then((res) => setCurrentProject(res.data))
        .catch(() => setCurrentProject(undefined));
    });
    const onCurrentThemeUpdated = listen("current_theme_updated", () => {
      ipc_invoke<Theme>("get_current_theme").then((res) => {
        applyTheme(res.data);
        setCurrentTheme(res.data);
      });
    });

    return () =>
      Promise.all([
        onSessionSaved,
        onQueueDeactivated,
        onQueueActivated,
        onProjectCreated,
        onProjectDeleted,
        onCurrentThemeUpdated,
        onSettingsUpdated,
        onCurrentProjectUpdated,
        onThemePreview,
      ]).then((values) => values.forEach((v) => v())) as never;
  }, []);

  return (
    <>
      <Routes>
        <Route index element={<MainWindow />} />
        <Route path="settings" element={<SettingsWindow />} />
        <Route path="projects" element={<ProjectsWindow />} />
        <Route path="analytics" element={<AnalyticsWindow />} />
        <Route path="queues" element={<QueuesWindow />} />
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            padding: 4,
            backgroundColor: "var(--base-color)",
            border: 2,
            borderColor: "var(--window-color)",
            borderRadius: 4,
            fontSize: 14,
            color: "var(--text-color)",
            textAlign: "center",
          },
        }}
      />
    </>
  );
};

export default App;
