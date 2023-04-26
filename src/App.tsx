import React from "react";
import { Route, Routes } from "react-router-dom";

const MainWindow = React.lazy(() => import("./windows/main"));
const SettingsWindow = React.lazy(() => import("./windows/settings"));
const IntentsWindow = React.lazy(() => import("./windows/intents"));
const AnalyticsWindow = React.lazy(() => import("./windows/analytics"));

const App: React.FC = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route index element={<MainWindow />} />
        <Route path="settings" element={<SettingsWindow />} />
        <Route path="intents" element={<IntentsWindow />} />
        <Route path="analytics" element={<AnalyticsWindow />} />
      </Routes>
    </React.Fragment>
  );
};

export default App;
