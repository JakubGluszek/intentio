import React from "react";
import { MdAnalytics } from "react-icons/md";

import { WindowContainer } from "@/components";
import { Card, Pane, Titlebar } from "@/ui";
import useStore from "@/store";
import ipc from "@/ipc";

import { Statistics } from "./Statistics";
import { Calendar, useCalendar } from "./Calendar";

const AnalyticsWindow: React.FC = () => {
  const store = useStore();
  const calendar = useCalendar({ sessions: store.sessions });

  React.useEffect(() => {
    ipc.getSessions().then((data) => {
      store.setSessions(data);
      console.log(data);
    });
  }, []);

  return (
    <WindowContainer>
      <div className="grow flex flex-col gap-0.5">
        <Titlebar title="Analytics" icon={MdAnalytics} />

        <Pane className="grow flex flex-col" padding="lg">
          <Statistics intents={store.intents} sessions={store.sessions} />
          <Card className="border-2 bg-darker/10 hover:bg-darker/20 border-primary/60 hover:border-primary/80">
            <Calendar days={calendar.days} theme={store.currentTheme!} />
          </Card>
        </Pane>
      </div>
    </WindowContainer>
  );
};

export default AnalyticsWindow;
