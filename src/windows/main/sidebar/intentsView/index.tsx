import React from "react";
import { MdAnalytics } from "react-icons/md";
import { motion } from "framer-motion";
import { WebviewWindow } from "@tauri-apps/api/window";

import useStore from "@/store";
import ipc from "@/ipc";
import { Button, IntentsList } from "@/components";
import config from "@/config";
import { useEvents } from "@/hooks";
import { Intent } from "@/bindings/Intent";
import CreateIntent from "./CreateIntent";
import motions from "@/motions";

const IntentsView: React.FC = () => {
  const [selectedIntentTags, setSelectedIntentTags] = React.useState<string[]>(
    []
  );
  const store = useStore();

  const onIntentChange = async (data: Intent | undefined) => {
    store.setCurrentIntent(data);
  };

  useEvents({
    intent_created: (data) => store.addIntent(data),
    intent_updated: (data) => store.patchIntent(data.id, data),
    intent_deleted: (data) => {
      if (store.currentIntent?.id === data.id) {
        store.setCurrentIntent(undefined);
      }

      store.removeIntent(data.id);
    },
    intent_archived: (data) => {
      if (store.currentIntent?.id === data.id) {
        store.setCurrentIntent(undefined);
      }

      store.patchIntent(data.id, data);
    },
    intent_unarchived: (data) => store.patchIntent(data.id, data),
  });

  React.useEffect(() => {
    ipc.getIntents().then((data) => store.setIntents(data));
  }, []);

  return (
    <div className="grow flex flex-col gap-0.5">
      <motion.div className="w-full flex flex-row gap-0.5" {...motions.scaleIn}>
        <CreateIntent />
        <div className="window">
          <Button
            onClick={() =>
              new WebviewWindow("intents", config.webviews.intents)
            }
            transparent
          >
            <MdAnalytics size={24} />
          </Button>
        </div>
      </motion.div>

      <motion.div
        className="grow flex flex-col p-1.5 window"
        {...motions.scaleIn}
      >
        <IntentsList
          data={store.intents.filter((intent) => !intent.archived_at)}
          selectedIntentId={store.currentIntent?.id}
          selectedTags={selectedIntentTags}
          onSelected={onIntentChange}
          onTagSelected={(data) => setSelectedIntentTags(data)}
        />
      </motion.div>
    </div>
  );
};

export default IntentsView;
