import React from "react";
import { MdAnalytics } from "react-icons/md";

import { Calendar, Titlebar, useCalendar, WindowContainer } from "@/components";
import { Pane } from "@/ui";
import useStore from "@/store";
import ipc from "@/ipc";

const AnalyticsWindow: React.FC = () => {
  const store = useStore();
  const calendar = useCalendar({ sessions: store.sessions });

  React.useEffect(() => {
    ipc.getSessions().then((data) => store.setSessions(data));
  }, []);

  return (
    <WindowContainer>
      <div className="grow flex flex-col gap-0.5 rounded overflow-clip">
        <Titlebar title="Analytics" icon={<MdAnalytics size={24} />} />

        <Pane className="grow flex flex-col">
          <Calendar days={calendar.days} theme={store.currentTheme!} />
        </Pane>
      </div>
    </WindowContainer>
  );
};

export default AnalyticsWindow;
