import React from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import utils from "@/utils";
import services from "@/app/services";
import { useStore } from "@/app/store";
import { useEvent } from "@/hooks";

import.meta.env.PROD &&
  document.addEventListener("contextmenu", (event) => event.preventDefault());

const MainWindow = React.lazy(() => import("./windows/main"));
const SettingsWindow = React.lazy(() => import("./windows/settings"));
const IntentsWindow = React.lazy(() => import("./windows/intents"));

const App: React.FC = () => {
  const store = useStore();

  React.useEffect(() => {
    services.getCurrentTheme().then((data) => store.setCurrentTheme(data));
    services.getSettings().then((data) => store.setSettings(data));
  }, []);

  useEvent("settings_updated", (event) => store.setSettings(event.payload));
  useEvent("current_theme_updated", () =>
    services.getCurrentTheme().then((data) => {
      store.setCurrentTheme(data);
      utils.applyTheme(data);
    })
  );

  return (
    <>
      <Routes>
        <Route index element={<MainWindow />} />
        <Route path="settings" element={<SettingsWindow />} />
        <Route path="intents" element={<IntentsWindow />} />
      </Routes>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 2000,
          style: {
            padding: 4,
            backgroundColor: "rgb(var(--base-color))",
            border: 2,
            borderColor: "rgb(var(--window-color))",
            borderRadius: 4,
            fontSize: 14,
            color: "rgb(var(--text-color))",
            textAlign: "center",
          },
        }}
      />
    </>
  );
};

export default App;
