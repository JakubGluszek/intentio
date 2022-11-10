import React from "react";
import { Route, Routes } from "react-router-dom";

import { ipc_invoke } from "./ipc";
import { Theme } from "./bindings/Theme";
import { applyTheme } from "./utils";

import MainWindow from "./windows/main";
import SettingsWindow from "./windows/settings";
import ProjectsWindow from "./windows/projects";
import AnalyticsWindow from "./windows/analytics";
import QueuesWindow from "./windows/queues";

import useGlobal from "./store";
import { Settings } from "./bindings/Settings";
import { Project } from "./bindings/Project";
import useEvents from "./events";

import.meta.env.PROD &&
  document.addEventListener("contextmenu", (event) => event.preventDefault());

const App: React.FC = () => {
  useEvents();

  const setCurrentTheme = useGlobal((state) => state.setCurrentTheme);
  const setSettings = useGlobal((state) => state.setSettings);
  const setCurrentProject = useGlobal((state) => state.setCurrentProject);
  const setProjects = useGlobal((state) => state.setProjects);

  React.useEffect(() => {
    ipc_invoke<Settings>("get_settings").then((res) => setSettings(res.data));
    ipc_invoke<Project[]>("get_projects").then((res) => setProjects(res.data));
    ipc_invoke<Project>("get_current_project")
      .then((res) => setCurrentProject(res.data))
      .catch(() => setCurrentProject(undefined));
    ipc_invoke<Theme>("get_current_theme")
      .then((res) => {
        applyTheme(res.data);
        setCurrentTheme(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <Routes>
      <Route index element={<MainWindow />} />
      <Route path="settings" element={<SettingsWindow />} />
      <Route path="projects" element={<ProjectsWindow />} />
      <Route path="analytics" element={<AnalyticsWindow />} />
      <Route path="queues" element={<QueuesWindow />} />
    </Routes>
  );
};

export default App;
