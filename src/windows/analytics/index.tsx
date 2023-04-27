import React from "react";

import {
  Calendar,
  IntentsList,
  Titlebar,
  useCalendar,
  WindowContainer,
} from "@/components";
import { MdAnalytics } from "react-icons/md";
import { Pane } from "@/ui";
import useStore from "@/store";
import ipc from "@/ipc";
import { Intent } from "@/bindings/Intent";

const AnalyticsWindow: React.FC = () => {
  const [selectedIntent, setSelectedIntent] = React.useState<Intent>();

  const store = useStore();
  const calendar = useCalendar({ sessions: store.sessions });

  React.useEffect(() => {
    ipc.getSessions().then((data) => store.setSessions(data));
    ipc.getIntents().then((data) => store.setIntents(data));
  }, []);

  return (
    <WindowContainer>
      <div className="grow flex flex-col gap-0.5 rounded overflow-clip">
        <Titlebar title="Analytics" icon={<MdAnalytics size={24} />} />

        <div className="grow flex flex-row gap-0.5">
          <Pane className="w-[240px] h-full flex flex-col">
            <IntentsList
              data={store.intents}
              selectedIntentId={selectedIntent?.id}
              selectedTags={[]}
              onSelected={(intent) => setSelectedIntent(intent)}
              onTagSelected={() => null}
            />
          </Pane>
          <Pane className="grow flex flex-col">
            <Calendar days={calendar.days} theme={store.currentTheme!} />
          </Pane>
        </div>
      </div>
    </WindowContainer>
  );
};

export default AnalyticsWindow;
