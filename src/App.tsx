import React from "react";
import { Route, Routes } from "react-router-dom";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/tauri";

import { applyTheme } from "./utils";
import { Settings } from "./types";
import MainWindow from "./windows/main";
import SettingsWindow from "./windows/settings";
import ProjectsWindow from "./windows/projects";

import.meta.env.PROD &&
  document.addEventListener("contextmenu", (event) => event.preventDefault());

const App: React.FC = () => {
  React.useEffect(() => {
    invoke<Settings>("settings_read").then((settings) => {
      applyTheme(settings.theme.current_theme);
    });

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
