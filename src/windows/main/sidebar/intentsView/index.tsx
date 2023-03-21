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
    <motion.div
      className="grow flex flex-col gap-0.5"
      transition={{ duration: 0.3 }}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1.0, opacity: 1 }}
    >
      <motion.div
        className="w-full flex flex-row gap-0.5"
        transition={{ delay: 0.1, duration: 0.3 }}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 36 }}
      >
        <CreateIntent />
        <div className="window">
          <Button
            onClick={() =>
              new WebviewWindow("intents", config.webviews.intents)
            }
            transparent
            transition={{ delay: 0.2, duration: 0.3 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <MdAnalytics size={24} />
          </Button>
        </div>
      </motion.div>

      <div className="grow flex flex-col p-1.5 window">
        <IntentsList
          data={store.intents.filter((intent) => !intent.archived_at)}
          selectedIntentId={store.currentIntent?.id}
          selectedTags={selectedIntentTags}
          onSelected={onIntentChange}
          onTagSelected={(data) => setSelectedIntentTags(data)}
        />
      </div>
    </motion.div>
  );
};

export default IntentsView;
