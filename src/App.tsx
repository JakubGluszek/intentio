import React from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import utils from "@/utils";
import { useEvent } from "@/hooks";
import ipc from "@/ipc";
import useStore from "@/store";

document.addEventListener("contextmenu", (event) => {
  if (import.meta.env.PROD) event.preventDefault();
  else {
    !event.ctrlKey && event.preventDefault();
  }
});

const MainWindow = React.lazy(() => import("./windows/main"));
const SettingsWindow = React.lazy(() => import("./windows/settings"));
const IntentsWindow = React.lazy(() => import("./windows/intents"));

const App: React.FC = () => {
  const store = useStore();

  useEvent("settings_updated", (event) => store.setSettings(event.payload));
  useEvent("current_theme_updated", () =>
    ipc.getCurrentTheme().then((data) => {
      store.setCurrentTheme(data);
      utils.applyTheme(data);
    })
  );

  React.useEffect(() => {
    ipc.getSettings().then((data) => store.setSettings(data));
  }, []);

  return (
    <>
      <Routes>
        <Route index element={<MainWindow />} />
        <Route path="settings" element={<SettingsWindow />} />
        <Route path="intents" element={<IntentsWindow />} />
      </Routes>
      <Toaster
        position="top-center"
        containerStyle={{ top: 8, zIndex: 9999999 }}
        toastOptions={{
          duration: 1400,
          style: {
            padding: 1,
            paddingInline: 2,
            backgroundColor: "rgb(var(--base-color))",
            border: 2,
            borderColor: "rgb(var(--text-color))",
            borderRadius: 2,
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
