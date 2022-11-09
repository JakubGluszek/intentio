import React from "react";
import { MdAnalytics, MdClose, MdToday } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { AiFillFire } from "react-icons/ai";
import { appWindow } from "@tauri-apps/api/window";

import { Session } from "../../bindings/Session";
import Layout from "../../components/Layout";
import { ipc_invoke } from "../../ipc";
import ActivityView from "../../components/ActivityView";
import useGlobal from "../../store";

// TODO: Add details & projects view
const AnalyticsWindow: React.FC = () => {
  const sessions = useGlobal((state) => state.sessions);
  const setSessions = useGlobal((state) => state.setSessions);

  React.useEffect(() => {
    ipc_invoke<Session[]>("get_sessions")
      .then((res) => setSessions(res.data))
      .catch((err) => console.log(err));
  }, []);

  const today = new Date();

  const totalFocused = (
    sessions.reduce((p, c) => p + c.duration, 0) / 60
  ).toFixed(1);

  const focusedToday = (
    sessions
      .filter(
        (s) =>
          new Date(parseInt(s.finished_at)).toDateString() ==
          today.toDateString()
      )
      .reduce((p, c) => p + c.duration, 0) / 60
  ).toFixed(1);

  let dayStreak = 1;

  let sorted = sessions.sort(
    (a, b) => parseInt(b.finished_at) - parseInt(a.finished_at)
  );
  let prevDay = new Date();
  // there might be timezone related issues
  for (let i = 0; i < sorted.length; i++) {
    let s = sorted[i];
    let date = new Date(parseInt(s.finished_at));

    if (date.toDateString() === prevDay.toDateString()) continue;
    date.setDate(date.getDate() + 1);

    if (date.toDateString() === prevDay.toDateString()) {
      dayStreak += 1;
      prevDay = new Date(parseInt(s.finished_at));
    } else {
      break;
    }
  }

  return (
    <Layout>
      <div className="min-h-screen flex flex-col gap-2 p-4">
        {/* Header */}
        <div className="z-[50] sticky top-0 flex flex-col gap-2 bg-window py-2">
          <div
            data-tauri-drag-region
            className="flex flex-row items-center justify-between"
          >
            <div className="flex flex-row items-center gap-2">
              <MdAnalytics size={32} />
              <span>Analytics</span>
            </div>
            <button className="btn btn-ghost" onClick={() => appWindow.close()}>
              <MdClose size={32} />
            </button>
          </div>
        </div>
        <ActivityView sessions={sessions} />
        <div className="grow flex flex-row gap-4 p-6 text-center">
          <div className="flex-1 flex flex-col items-center justify-evenly gap-1 p-2 bg-base rounded">
            <div className="flex flex-row items-center gap-2">
              <IoMdTime size={36} />
              <span>Total</span>
            </div>
            <span className="text-primary text-2xl">{totalFocused}h</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-evenly gap-1 p-2 bg-base rounded">
            <div className="flex flex-row items-center gap-2">
              <MdToday size={36} />
              <span>Today</span>
            </div>
            <span className="text-primary text-2xl">{focusedToday}h</span>
          </div>
          <div className="flex-1 flex flex-col items-center justify-evenly gap-1 p-2 bg-base rounded">
            <div className="flex flex-row items-center">
              <AiFillFire size={48} />
              <span>Day streak</span>
            </div>
            <span className="text-primary text-2xl">{dayStreak}</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsWindow;
