import React from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { ipc_invoke } from "./ipc";
import { Theme } from "./bindings/Theme";
import { applyTheme } from "./utils";
import useGlobal from "./store";
import { Settings } from "./bindings/Settings";
import useEvents from "./events";
import { Project } from "./bindings/Project";
import MainWindow from "./windows/main";

import.meta.env.PROD &&
  document.addEventListener("contextmenu", (event) => event.preventDefault());

const SettingsWindow = React.lazy(() => import("./windows/settings"));
const ProjectsWindow = React.lazy(() => import("./windows/projects"));
const AnalyticsWindow = React.lazy(() => import("./windows/analytics"));
const QueuesWindow = React.lazy(() => import("./windows/queues"));

const App: React.FC = () => {
  useEvents();

  const setSettings = useGlobal((state) => state.setSettings);
  const setCurrentTheme = useGlobal((state) => state.setCurrentTheme);
  const setProjects = useGlobal((state) => state.setProjects);

  React.useEffect(() => {
    ipc_invoke<Settings>("get_settings").then((res) => setSettings(res.data));
    ipc_invoke<Theme>("get_current_theme").then((res) => {
      applyTheme(res.data);
      setCurrentTheme(res.data);
    });
    ipc_invoke<Project[]>("get_projects").then((res) => setProjects(res.data));
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
          className:
            "p-0.5 bg-base border-2 border-window rounded text-sm text-text text-center shadow-xl",
        }}
      />
    </>
  );
};

export default App;
