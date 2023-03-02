import React from "react";
import { Route, Routes } from "react-router-dom";

const MainWindow = React.lazy(() => import("./windows/main"));
const SettingsWindow = React.lazy(() => import("./windows/settings"));
const IntentsWindow = React.lazy(() => import("./windows/intents"));
const CommandsWindow = React.lazy(() => import("./windows/commands"));

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route index element={<MainWindow />} />
        <Route path="settings" element={<SettingsWindow />} />
        <Route path="intents" element={<IntentsWindow />} />
        <Route path="commands" element={<CommandsWindow />} />
      </Routes>
    </>
  );
};

export default App;
