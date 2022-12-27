import React from "react";
import { BiTargetLock } from "react-icons/bi";

import Layout from "@/components/Layout";
import Sidebar from "./Sidebar";
import Dashboard from "./dashboard";
import IntentDetails from "./IntentDetails";
import { useStore } from "@/app/store";
import { useEvent } from "@/hooks";
import services from "@/app/services";

export type Sort = "asc" | "desc";

const IntentsWindow: React.FC = () => {
  const [selectedId, setSelectedId] = React.useState<string>();
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  const store = useStore();

  useEvent("intent_created", (event) => store.addIntent(event.payload));
  useEvent("intent_updated", (event) =>
    store.patchIntent(event.payload.id, event.payload)
  );

  React.useEffect(() => {
    services.getIntents().then((data) => store.setIntents(data));
    services.getSessions().then((data) => store.setSessions(data));
  }, []);

  const intent = store.getIntentById(selectedId);

  return (
    <Layout icon={<BiTargetLock size={32} />} label="Intents">
      <div className="grow flex flex-row">
        <Sidebar
          intents={store.intents}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
        />
        {intent ? (
          <IntentDetails
            data={intent}
            sessions={store.sessions.filter(
              (session) => session.intent_id === selectedId
            )}
          />
        ) : (
          <Dashboard
            sessions={store.sessions}
            intents={store.intents}
            tags={selectedTags}
          />
        )}
      </div>
    </Layout>
  );
};

export default IntentsWindow;
