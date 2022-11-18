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
  const setCurrentProject = useGlobal((state) => state.setCurrentProject);

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
            "--tw-shadow":
              "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
            "--tw-shadow-colored":
              "0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color)",
            boxShadow:
              "var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow)",
          },
        }}
      />
    </>
  );
};

export default App;
