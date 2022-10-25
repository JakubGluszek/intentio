import React from "react";
import { Route, Routes } from "react-router-dom";
import { listen } from "@tauri-apps/api/event";

import { ipc_invoke } from "./ipc";
import { Theme } from "./bindings/Theme";
import { applyTheme } from "./utils";

import MainWindow from "./windows/main";
import SettingsWindow from "./windows/settings";
import ProjectsWindow from "./windows/projects";
import useGlobal from "./store";

import.meta.env.PROD &&
  document.addEventListener("contextmenu", (event) => event.preventDefault());

const App: React.FC = () => {
  const setCurrentTheme = useGlobal((state) => state.setCurrentTheme);

  React.useEffect(() => {
    ipc_invoke<Theme>("get_current_theme")
      .then((res) => {
        applyTheme(res.data);
        setCurrentTheme(res.data);
      })
      .catch((err) => console.log(err));

    const unlisten = listen<string>("update_current_theme", (event) => {
      const theme = JSON.parse(event.payload) as Theme;
      applyTheme(theme);
      setCurrentTheme(theme);
    });

    return () => unlisten.then((f) => f()) as never;
  }, []);

  return (
    <Routes>
      <Route index element={<MainWindow />} />
      <Route path="settings" element={<SettingsWindow />} />
      <Route path="projects" element={<ProjectsWindow />} />
    </Routes>
  );
};

export default App;
