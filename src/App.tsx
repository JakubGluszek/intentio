import React from "react";
import { Route, Routes } from "react-router-dom";
import { listen } from "@tauri-apps/api/event";

import { ipc_invoke } from "./ipc";
import { Theme } from "./bindings/Theme";
import { applyTheme } from "./utils";

import MainWindow from "./windows/main";
import SettingsWindow from "./windows/settings";
import ProjectsWindow from "./windows/projects";

import.meta.env.PROD &&
  document.addEventListener("contextmenu", (event) => event.preventDefault());

const App: React.FC = () => {
  React.useEffect(() => {
    ipc_invoke<Theme>("get_current_theme")
      .then((res) => applyTheme(res.data))
      .catch((err) => console.log(err));

    listen<string>("update_current_theme", (event) => {
      applyTheme(JSON.parse(event.payload));
    });
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
