import React from "react";
import { Route, Routes } from "react-router-dom";
import HistoryPage from "./pages/HistoryPage";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";

const App: React.FC = () => {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="settings" element={<SettingsPage />} />
      <Route path="history" element={<HistoryPage />} />
    </Routes>
  );
};

export default App;
