import React from "react";
import { MdAnalytics, MdClose, MdToday } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { AiFillFire } from "react-icons/ai";
import { appWindow } from "@tauri-apps/api/window";
import { Tabs } from "@mantine/core";

import { Session } from "../../bindings/Session";
import Layout from "../../components/Layout";
import { ipc_invoke } from "../../ipc";
import ActivityView from "../../components/ActivityView";
import useGlobal from "../../store";
import DetailsView from "./DetailsView";
import ProjectsView from "./ProjectsView";
import { Project } from "../../bindings/Project";

const AnalyticsWindow: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState("");

  const sessions = useGlobal((state) => state.sessions);
  const setSessions = useGlobal((state) => state.setSessions);
  const setProjects = useGlobal((state) => state.setProjects);

  React.useEffect(() => {
    ipc_invoke<Session[]>("get_sessions")
      .then((res) => setSessions(res.data))
      .catch((err) => console.log(err));
    ipc_invoke<Project[]>("get_projects").then((res) => setProjects(res.data));
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

  React.useEffect(() => {
    window.scrollBy({ top: 180, behavior: "smooth" });
  }, [activeTab]);

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
              <span className="text-xl">Analytics</span>
            </div>
            <button className="btn btn-ghost" onClick={() => appWindow.close()}>
              <MdClose size={32} />
            </button>
          </div>
        </div>

        <ActivityView
          sessions={sessions}
          setDetailsView={(date: string) => {
            setActiveTab("details");
            setFilter(date);
            window.scrollTo(0, window.innerHeight);
          }}
        />

        <div className="grow flex flex-col">
          <div className="flex flex-row gap-4 px-4 py-2 text-center">
            <div className="flex-1 flex flex-col items-center justify-evenly gap-1 p-2 bg-base rounded">
              <div className="flex flex-row items-center gap-2">
                <IoMdTime size={32} />
                <span>Total</span>
              </div>
              <span className="text-primary text-xl">{totalFocused}h</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-evenly gap-1 p-2 bg-base rounded">
              <div className="flex flex-row items-center gap-2">
                <MdToday size={32} />
                <span>Today</span>
              </div>
              <span className="text-primary text-xl">{focusedToday}h</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-evenly gap-1 p-2 bg-base rounded">
              <div className="flex flex-row items-center gap-2">
                <AiFillFire size={34} />
                <span>Streak</span>
              </div>
              <span className="text-primary text-xl">{dayStreak} days</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <Tabs
          value={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
          }}
          unstyled
          allowTabDeactivation
          className="px-4"
          classNames={{
            tabsList: "flex flex-row",
            tabLabel: "text-primary",
            tab: "w-1/2 rounded p-1 transition-[width]",
          }}
          styles={{
            tab: {
              "&[data-active]": {
                width: "75%",
                backgroundColor: "var(--base-color)",
              },
            },
          }}
        >
          <Tabs.List grow>
            <Tabs.Tab value="details" className="text-lg">
              Details
            </Tabs.Tab>
            <Tabs.Tab value="projects" className="text-lg">
              Projects
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="details" pt="xs">
            <DetailsView filter={filter} setFilter={setFilter} />
          </Tabs.Panel>

          <Tabs.Panel value="projects" pt="xs">
            <ProjectsView />
          </Tabs.Panel>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AnalyticsWindow;
