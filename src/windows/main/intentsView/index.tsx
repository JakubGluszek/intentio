import React from "react";
import { RiArchiveLine, RiArchiveFill } from "react-icons/ri";
import { AnimatePresence, motion } from "framer-motion";

import useStore from "@/store";
import ipc from "@/ipc";
import { IntentView } from "@/components";
import { Button, ScrollArea, Tooltip } from "@/ui";
import { useEvents } from "@/hooks";

import CreateIntent from "./CreateIntent";

const IntentsView: React.FC = () => {
  const [viewCreate, setViewCreate] = React.useState(false);
  const [viewArchive, setViewArchive] = React.useState(false);

  const intentRef = React.useRef<HTMLDivElement>(null);

  const store = useStore();

  const intents = React.useMemo(() => {
    let intents = store.intents;

    intents.sort((a, b) =>
      a.label.toLowerCase().localeCompare(b.label.toLowerCase())
    );

    // sorts by pinned (meaning pinned intents are always first)
    intents.sort((a, b) => (a.pinned ? 0 : 1) - (b.pinned ? 0 : 1));

    return intents;
  }, [store.intents]);

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
    <div className="grow flex flex-col gap-1.5 p-1 glass rounded-sm overflow-clip">
      <div className="w-full flex flex-row items-center justify-between gap-1">
        <CreateIntent viewCreate={viewCreate} setViewCreate={setViewCreate} />

        {!viewCreate && (
          <Tooltip label={viewArchive ? "Hide Archive" : "View Archive"}>
            <Button
              variant="ghost"
              onClick={() => setViewArchive((prev) => !prev)}
            >
              <motion.div
                key={viewArchive ? 1 : 0}
                transition={{ duration: 0.3 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {viewArchive ? (
                  <RiArchiveFill size={20} />
                ) : (
                  <RiArchiveLine size={20} />
                )}
              </motion.div>
            </Button>
          </Tooltip>
        )}
      </div>

      <ScrollArea>
        <div className="flex flex-col gap-1">
          <AnimatePresence key={viewArchive ? 1 : 0} mode="popLayout">
            {intents
              .filter((intent) => !!intent.archived_at === viewArchive)
              .map((intent) => (
                <IntentView
                  key={intent.id}
                  ref={intentRef}
                  data={intent}
                  onClick={() => {
                    store.setCurrentIntent(
                      store.currentIntent?.id === intent.id ? undefined : intent
                    );
                  }}
                  active={store.currentIntent?.id === intent.id}
                />
              ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  );
};

export default IntentsView;
