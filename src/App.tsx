import React from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";

import { ipc_invoke } from "./app/ipc";
import { Theme } from "./bindings/Theme";
import { applyTheme } from "./utils";
import useGlobal from "./app/store";
import { Settings } from "./bindings/Settings";
import { Project } from "./bindings/Project";
import MainWindow from "./windows/main";
import { Session } from "./bindings/Session";
import { SessionQueue } from "./bindings/SessionQueue";
import { ModelDeleteResultData } from "./bindings/ModelDeleteResultData";
import { appWindow } from "@tauri-apps/api/window";

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

  React.useEffect(() => {
    const noDragSelector = "input, a, button"; // CSS selector

    const handleMouseDown = async (e: MouseEvent) => {
      if (
        // @ts-ignore
        e.target?.closest(noDragSelector) ||
        // @ts-ignore
        e.target?.dataset["tauri-disable-drag"] ||
        // @ts-ignore
        e.target?.parentElement.dataset["tauri-disable-drag"] ||
        // @ts-ignore
        e.target?.parentElement.parentElement.dataset["tauri-disable-drag"]
      )
        return; // a non-draggable element either in target or its ancestors
      await appWindow.startDragging();
    };

    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, []);

  // IPC calls needed for each window
  React.useEffect(() => {
    ipc_invoke<Settings>("get_settings").then((res) => setSettings(res.data));
    ipc_invoke<Project[]>("get_projects").then((res) => setProjects(res.data));
    invoke<Theme>("get_current_theme").then((data) => {
      applyTheme(data);
      setCurrentTheme(data);
    });
    invoke<Project>("get_current_project")
      .then((data) => setCurrentProject(data))
      .catch(() => setCurrentProject(undefined));
  }, []);

  const addProject = useGlobal((state) => state.addProject);
  const removeProject = useGlobal((state) => state.removeProject);
  const setSessionQueue = useGlobal((state) => state.setSessionQueue);
  const addSession = useGlobal((state) => state.addSession);
  const currentProject = useGlobal((state) => state.currentProject);

  // Events to listen for on each window
  React.useEffect(() => {
    const onSessionSaved = listen<Session>("session_saved", (event) =>
      addSession(event.payload)
    );
    const onQueueUpdated = listen<SessionQueue | null>(
      "set_session_queue",
      (event) => setSessionQueue(event.payload)
    );
    const onThemePreview = listen<Theme>("preview_theme", (event) => {
      applyTheme(event.payload);
    });
    const onSettingsUpdated = listen<Settings>("settings_updated", (event) => {
      setSettings(event.payload);
    });
    const onProjectCreated = listen<Project>("project_created", (event) => {
      addProject(event.payload);
    });

    const onProjectDeleted = listen<ModelDeleteResultData>(
      "project_deleted",
      (event) => {
        if (event.payload.id === currentProject?.id) {
          invoke("set_current_project", { data: undefined });
        }
        removeProject(event.payload.id);
      }
    );
    const onCurrentProjectUpdated = listen<Project>(
      "current_project_updated",
      (event) => {
        setCurrentProject(event.payload);
      }
    );
    const onCurrentThemeUpdated = listen("current_theme_updated", () => {
      invoke<Theme>("get_current_theme").then((data) => {
        applyTheme(data);
        setCurrentTheme(data);
      });
    });

    return () =>
      Promise.all([
        onSessionSaved,
        onQueueUpdated,
        onProjectCreated,
        onProjectDeleted,
        onCurrentThemeUpdated,
        onSettingsUpdated,
        onCurrentProjectUpdated,
        onThemePreview,
      ]).then((values) => values.forEach((v) => v())) as never;
  }, [currentProject]);

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
          duration: 2000,
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
