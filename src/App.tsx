import React from "react";
import { Route, Routes } from "react-router-dom";

const MainWindowLegacy = React.lazy(() => import("./windows/main-legacy"));
const SettingsWindow = React.lazy(() => import("./windows/settings"));
const AnalyticsWindow = React.lazy(() => import("./windows/analytics"));
const TestTimerWindow = React.lazy(() => import("./windows/TestTimerWindow"));
const MainWindow = React.lazy(() => import("./windows/main"));
const NewSettingsWindowDemo = React.lazy(
  () => import("./windows/NewSettingsWindowDemo")
);

const App: React.FC = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route index element={<MainWindowLegacy />} />
        <Route path="settings" element={<SettingsWindow />} />
        <Route path="analytics" element={<AnalyticsWindow />} />
        <Route path="timer" element={<TestTimerWindow />} />
        <Route path="new-main" element={<MainWindow />} />
        <Route path="new-settings" element={<NewSettingsWindowDemo />} />
      </Routes>
    </React.Fragment>
  );
};

export default App;
