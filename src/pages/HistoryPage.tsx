import { invoke } from "@tauri-apps/api/tauri";
import React from "react";
import Layout from "../components/Layout";
import { Pomodoro } from "../types";

const HistoryPage: React.FC = () => {
  const [pomodoros, setPomodoros] = React.useState<Pomodoro[]>([]);

  React.useEffect(() => {
    invoke<Pomodoro[]>("read_pomodoros").then((p) => setPomodoros(p));
  }, []);

  return (
    <Layout>
      <h1>History</h1>
      <div className="flex flex-col gap-2">
        {pomodoros.map((p) => (
          <div key={p.id} className="border flex flex-col">
            <span>Duration: {p.duration}</span>
            <span>Date: {new Date(p.started_at).toISOString()}</span>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default HistoryPage;
