import { WebviewWindow } from "@tauri-apps/api/window";
import React from "react";
import Layout from "../components/Layout";
import Timer from "../components/Timer";
import useSettings from "../hooks/useSettings";
import { listen } from "@tauri-apps/api/event";
import { MdHistory, MdSettings } from "react-icons/md";

const HomePage: React.FC = () => {
  const { settings, setSettings } = useSettings();

  React.useEffect(() => {
    listen<string>("update_settings", (event) => {
      setSettings(JSON.parse(event.payload));
    });
  }, []);

  return (
    <Layout>
      <div className="absolute top-4 right-4 flex flex-row items-center gap-4">
        <button
          className="btn"
          onClick={() =>
            new WebviewWindow("settings", {
              url: "/settings",
              width: 344,
              height: 464,
              resizable: false,
              visible: true,
            })
          }
        >
          <MdSettings size={24} />
        </button>
        <button
          className="btn"
          onClick={() =>
            new WebviewWindow("history", {
              url: "/history",
              width: 344,
              height: 464,
              resizable: false,
            })
          }
        >
          <MdHistory size={24} />
        </button>
      </div>
      {settings && <Timer settings={settings} />}
    </Layout>
  );
};

export default HomePage;
