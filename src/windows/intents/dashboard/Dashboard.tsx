import React from "react";

import ActivityView from "./ActivityView";
import TimelineView from "./TimelineView";
import Button from "@/components/Button";
import { Session } from "@/bindings/Session";
import { Intent } from "@/bindings/Intent";

type Tab = "activity" | "timeline";

interface Props {
  intents: Intent[];
  tags: string[];
  sessions: Session[];
}

const Dashboard: React.FC<Props> = (props) => {
  const [tab, setTab] = React.useState<Tab>("activity");
  const [filter, setFilter] = React.useState("");

  const viewDayDetails = (date: string) => {
    setFilter(date);
    setTab("timeline");
  };

  let reducedSessions = props.sessions;
  let intents = props.intents;

  // reduce intents by given tags
  if (props.tags.length > 0) {
    if (props.tags.length === 1) {
      intents = intents.filter((intent) =>
        props.tags.some((tag) => intent.tags.includes(tag))
      );
    } else if (props.tags.length > 1) {
      intents = intents.filter((intent) =>
        props.tags.every((tag) => intent.tags.includes(tag))
      );
    }

    // reduce sessions by leftover intents
    reducedSessions = props.sessions.filter((session) =>
      intents.some((intent) => intent.id === session.intent_id)
    );
  }

  return (
    <div className="grow flex flex-col p-2 gap-2">
      <div className="grow flex flex-col gap-2 p-2 bg-darker/20 rounded inner-shadow">
        {tab === "activity" ? (
          <ActivityView
            sessions={reducedSessions}
            intents={intents}
            tags={props.tags}
            viewDayDetails={viewDayDetails}
          />
        ) : (
          <TimelineView
            intents={intents}
            sessions={reducedSessions}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>
      <div className="h-7 flex flex-row items-center gap-2">
        <Tabs value={tab} setValue={setTab} />
      </div>
    </div>
  );
};

interface TabsProps {
  value: Tab;
  setValue: React.Dispatch<React.SetStateAction<Tab>>;
}

const Tabs: React.FC<TabsProps> = (props) => {
  return (
    <div className="w-full h-full flex flex-row gap-0.5 rounded overflow-clip">
      <Button
        primary={props.value === "activity"}
        rounded={false}
        size="fill"
        onClick={() => {
          props.setValue("activity");
        }}
      >
        Activity
      </Button>
      <Button
        primary={props.value === "timeline"}
        rounded={false}
        size="fill"
        onClick={() => props.setValue("timeline")}
      >
        Timeline
      </Button>
    </div>
  );
};

export default Dashboard;
