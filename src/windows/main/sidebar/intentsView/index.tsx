import React from "react";
import { RiArchiveLine, RiArchiveFill } from "react-icons/ri";

import useStore from "@/store";
import ipc from "@/ipc";
import { IntentList } from "@/components";
import { Button, Tooltip } from "@/ui";
import { useEvents } from "@/hooks";
import CreateIntent from "./CreateIntent";
import { toast } from "react-hot-toast";

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
    <div className="grow flex flex-col gap-1 p-1 bg-base/10 rounded-sm">
      <div className="w-full flex flex-row items-center justify-between gap-1">
        <CreateIntent />

        <Tooltip label={viewArchive ? "Hide Archive" : "View Archive"}>
          <Button
            variant="ghost"
            onClick={() => setViewArchive((prev) => !prev)}
          >
            {viewArchive ? (
              <RiArchiveFill size={24} />
            ) : (
              <RiArchiveLine size={24} />
            )}
          </Button>
        </Tooltip>
      </div>

      <IntentList
        data={store.intents.filter(
          (intent) => !!intent.archived_at === viewArchive
        )}
        selectedIntent={store.currentIntent}
        onIntentSelected={(data) => {
          store.setCurrentIntent(data);
          data && toast("Intent selected");
        }}
      />
    </div>
  );
};

export default IntentsView;
