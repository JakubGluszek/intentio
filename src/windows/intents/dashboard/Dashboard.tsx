import React from "react";
import clsx from "clsx";

import { Intent } from "..";
import ActivityView from "./ActivityView";
import SessionsView from "./SessionsView";
import Button from "@/components/Button";

type Tab = "activity" | "sessions";

interface Props {
  intents: Intent[];
  selectedTags: string[];
}

const Dashboard: React.FC<Props> = (props) => {
  const [tab, setTab] = React.useState<Tab>("activity");

  return (
    <div className="grow flex flex-col gap-2 p-2">
      {tab === "activity" ? (
        <ActivityView intents={props.intents} tags={props.selectedTags} />
      ) : (
        <SessionsView />
      )}
      <div className="h-8 flex flex-row items-center gap-2">
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
        primary={props.value === "sessions"}
        rounded={false}
        size="fill"
        onClick={() => props.setValue("sessions")}
      >
        Sessions
      </Button>
    </div>
  );
};

export default Dashboard;
