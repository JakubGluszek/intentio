import React from "react";
import { Route, Routes } from "react-router-dom";
import History from "./pages/History";
import Home from "./pages/Home";
import Settings from "./pages/Settings";

const App: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="settings" element={<Settings />} />
      <Route path="history" element={<History />} />
    </Routes>
  );
};

export default App;
