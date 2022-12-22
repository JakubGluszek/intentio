import React from "react";
import { BiTargetLock } from "react-icons/bi";

import Layout from "@/components/Layout";
import { DUMMY_INTENTS, DUMMY_SESSIONS } from "./mockData";
import Sidebar from "./Sidebar";
import Dashboard from "./dashboard";
import IntentDetails from "./IntentDetails";

export type Sort = "asc" | "desc";

export interface Intent {
  id: string | number;
  label: string;
  pinned: boolean;
  tags: string[];
}

const IntentsWindow: React.FC = () => {
  const [intents, setIntents] = React.useState<Intent[]>(DUMMY_INTENTS);
  const [selected, setSelected] = React.useState<Intent>();
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [sessions, setSessions] = React.useState(DUMMY_SESSIONS);

  return (
    <Layout icon={<BiTargetLock size={32} />} label="Intents">
      <div className="grow flex flex-row">
        <Sidebar
          intents={intents}
          selected={selected}
          setSelected={setSelected}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
        {selected ? (
          <IntentDetails
            data={selected}
            // @ts-ignore
            sessions={sessions.filter(
              (session) => session.intent_id === selected?.id
            )}
          />
        ) : (
          <Dashboard
            // @ts-ignore
            sessions={sessions}
            intents={intents}
            tags={selectedTags}
          />
        )}
      </div>
    </Layout>
  );
};

export default IntentsWindow;
