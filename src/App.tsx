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
import { Queue } from "./bindings/Queue";
import { ActiveQueue } from "./bindings/ActiveQueue";
import { Session } from "./bindings/Session";
import { Toaster } from "react-hot-toast";

import.meta.env.PROD &&
  document.addEventListener("contextmenu", (event) => event.preventDefault());

const App: React.FC = () => {
  useEvents();

  const setCurrentTheme = useGlobal((state) => state.setCurrentTheme);
  const setSettings = useGlobal((state) => state.setSettings);
  const setCurrentProject = useGlobal((state) => state.setCurrentProject);
  const setProjects = useGlobal((state) => state.setProjects);
  const setQueues = useGlobal((state) => state.setQueues);
  const setActiveQueue = useGlobal((state) => state.setActiveQueue);
  const setSessions = useGlobal((state) => state.setSessions);

  React.useEffect(() => {
    ipc_invoke<ActiveQueue | null>("get_active_queue").then((res) =>
      setActiveQueue(res.data)
    );

    ipc_invoke<Session[]>("get_sessions").then((res) => setSessions(res.data));

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

    ipc_invoke<Queue[]>("get_queues")
      .then((res) => setQueues(res.data))
      .catch((err) => console.log(err));
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
        position="top-center"
        toastOptions={{
          className:
            "p-0.5 bg-base border border-primary rounded text-sm text-text text-center",
        }}
      />
    </>
  );
};

export default App;
