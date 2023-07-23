import React from "react";
import { Route, Routes } from "react-router-dom";

import { IntentsView } from "./windows/main/intents";
import { MainWindow } from "./windows/main";
import { TimerView } from "./windows/main/timer";
import { TasksView } from "./windows/main/tasks";
import SettingsWindow from "./windows/settings";
import AnalyticsWindow from "./windows/analytics";
import SummaryWindow from "./windows/summary";
import TinyTimerWindow from "./windows/tiny-timer";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="*" element={<MainWindow />}>
        <Route path="intents" element={<IntentsView />} />
        <Route path="timer" element={<TimerView />} />
        <Route path="tasks" element={<TasksView />} />
      </Route>
      <Route path="/settings" element={<SettingsWindow />} />
      <Route path="/analytics" element={<AnalyticsWindow />} />
      <Route path="/summary" element={<SummaryWindow />} />
      <Route path="/tiny-timer" element={<TinyTimerWindow />} />
    </Routes>
  );
};

export default App;
