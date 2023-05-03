import React from "react";
import { MdAnalytics } from "react-icons/md";
import { RiArchiveDrawerFill, RiArchiveDrawerLine } from "react-icons/ri";
import { WebviewWindow } from "@tauri-apps/api/window";

import useStore from "@/store";
import ipc from "@/ipc";
import { IntentList } from "@/components";
import { Button, Pane, Tooltip } from "@/ui";
import config from "@/config";
import { useEvents } from "@/hooks";
import CreateIntent from "./CreateIntent";

const IntentsView: React.FC = () => {
  const [viewArchive, setViewArchive] = React.useState(false);

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
    <Pane className="grow flex flex-col gap-2" padding="lg">
      <div className="w-full flex flex-row items-center justify-between gap-1">
        <CreateIntent />
        <div className="flex flex-row gap-0.5">
          <Tooltip label={viewArchive ? "Hide Archive" : "View Archive"}>
            <Button
              variant="ghost"
              onClick={() => setViewArchive((prev) => !prev)}
            >
              {viewArchive ? (
                <RiArchiveDrawerFill size={22} />
              ) : (
                <RiArchiveDrawerLine size={22} />
              )}
            </Button>
          </Tooltip>

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
      </div>

      <IntentList
        data={store.intents.filter(
          (intent) => !!intent.archived_at === viewArchive
        )}
        selectedIntent={store.currentIntent}
        onIntentSelected={(data) => store.setCurrentIntent(data)}
      />
    </Pane>
  );
};

export default IntentsView;
