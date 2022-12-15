import React from "react";
import { BiTargetLock } from "react-icons/bi";

import Layout from "@/components/Layout";
import { DUMMY_INTENTS } from "./mockData";
import Sidebar from "./Sidebar";
import Dashboard from "./dashboard";
import IntentDetails from "./IntentDetails";
import { Intent } from ".";

const IntentsWindow: React.FC = () => {
  const [intents, setIntents] = React.useState<Intent[]>(DUMMY_INTENTS);
  const [selected, setSelected] = React.useState<Intent>();
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

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
          <IntentDetails data={selected} />
        ) : (
          <Dashboard intents={intents} selectedTags={selectedTags} />
        )}
      </div>
    </Layout>
  );
};

export default IntentsWindow;
