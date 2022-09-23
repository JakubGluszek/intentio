import { WebviewWindow } from "@tauri-apps/api/window";
import React from "react";
import Layout from "../components/Layout";
import Timer from "../components/Timer";
import useSettings from "../hooks/useSettings";
import { listen } from "@tauri-apps/api/event";

const HomePage: React.FC = () => {
  const { settings, setSettings } = useSettings();

  listen<string>("update_settings", (event) => {
    setSettings(JSON.parse(event.payload));
  });

  return (
    <Layout>
      <button
        className="absolute right-2 top-2"
        onClick={() =>
          new WebviewWindow("settings", {
            url: "/settings",
            width: 480,
            height: 600,
          })
        }
      >
        Settings
      </button>
      <div className="m-auto w-[80vw] h-[80vh]">
        {settings && <Timer settings={settings} />}
      </div>
    </Layout>
  );
};

export default HomePage;
