import React from "react";
import { MdAnalytics } from "react-icons/md";
import { WebviewWindow } from "@tauri-apps/api/window";

import useStore from "@/store";
import ipc from "@/ipc";
import { IntentList } from "@/components";
import { Button, Pane, Tooltip } from "@/ui";
import config from "@/config";
import { useEvents } from "@/hooks";
import CreateIntent from "./CreateIntent";

const IntentsView: React.FC = () => {
  const store = useStore();

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
        <Tooltip label="Open Analytics">
          <Button
            variant="ghost"
            onClick={() =>
              new WebviewWindow("analytics", config.windows.analytics)
            }
          >
            <MdAnalytics size={24} />
          </Button>
        </Tooltip>
      </div>

      <IntentList
        data={store.intents.filter((intent) => !intent.archived_at)}
        selectedIntent={store.currentIntent}
        onIntentSelected={(data) => store.setCurrentIntent(data)}
      />
    </Pane>
  );
};

export default IntentsView;
