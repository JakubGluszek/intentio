import React from "react";
import { Route, Routes } from "react-router-dom";
import MainWindow from "./windows/MainWindow";
import SettingsWindow from "./windows/SettingsWindow";
import ProjectsWindow from "./windows/ProjectsWindow";

const App: React.FC = () => {
  return (
    <Routes>
      <Route index element={<MainWindow />} />
      <Route path="settings" element={<SettingsWindow />} />
      <Route path="projects" element={<ProjectsWindow />} />
    </Routes>
  );
};

export default App;
