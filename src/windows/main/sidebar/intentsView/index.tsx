import React from "react";
import { MdAnalytics } from "react-icons/md";
import { WebviewWindow } from "@tauri-apps/api/window";

import useStore from "@/store";
import ipc from "@/ipc";
import { IntentsList } from "@/components";
import { Button, Pane } from "@/ui";
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
    <Pane className="grow flex flex-col gap-2">
      <div className="w-full flex flex-row items-center justify-between gap-1">
        <CreateIntent />
        <Button
          variant="ghost"
          onClick={() => new WebviewWindow("intents", config.windows.intents)}
        >
          <MdAnalytics size={24} />
        </Button>
      </div>

      <IntentsList
        data={store.intents.filter((intent) => !intent.archived_at)}
        selectedIntentId={store.currentIntent?.id}
        selectedTags={selectedIntentTags}
        onSelected={onIntentChange}
        onTagSelected={(data) => setSelectedIntentTags(data)}
      />
    </Pane>
  );
};

export default IntentsView;
