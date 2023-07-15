import React from "react";
import { Route, Routes } from "react-router-dom";

import { WindowContainer } from "@/components";

import { IntentsView } from "./windows/main/intents";
import { MainWindow } from "./windows/main";
import { TimerView } from "./windows/main/timer";
import SettingsWindow from "./windows/settings";
import AnalyticsWindow from "./windows/analytics";

const App: React.FC = () => {
  return (
    <WindowContainer>
      <Routes>
        <Route path="*" element={<MainWindow />}>
          <Route path="intents" element={<IntentsView />} />
          <Route path="timer" element={<TimerView />} />
        </Route>
        <Route path="/settings" element={<SettingsWindow />} />
        <Route path="/analytics" element={<AnalyticsWindow />} />
      </Routes>
    </WindowContainer>
  );
};

export default App;
