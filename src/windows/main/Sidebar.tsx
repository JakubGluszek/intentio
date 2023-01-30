import React from "react";
import { BiTargetLock } from "react-icons/bi";
import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { MdOpenInNew } from "react-icons/md";
import { useClickOutside } from "@mantine/hooks";
import { WebviewWindow } from "@tauri-apps/api/window";

import useStore from "@/store";
import config from "@/config";
import services from "@/services";
import Button from "@/components/Button";
import QueueIcon from "@/components/QueueIcon";
import { Intent } from "@/bindings/Intent";
import IntentsList from "../intents/IntentsList";

interface Props {
  isVisible: boolean;
  collapse: () => void;
}

type Tab = "intents" | "queue";

const Sidebar: React.FC<Props> = (props) => {
  const [tab, setTab] = React.useState<Tab>("intents");
  const [selectedIntentTags, setSelectedIntentTags] = React.useState<string[]>(
    []
  );

  const ref = useClickOutside(() => props.collapse());

  const store = useStore();

  const onIntentChange = async (data: Intent | undefined) => {
    await services.setActiveIntentId(data?.id).then(() => {
      store.setActiveIntentId(data?.id);
    });
  };

  return (
    <div
      ref={ref}
      className="z-[9999] left-0 top-0 fixed w-[286px] h-full flex flex-col bg-window transition-opacity"
      style={{
        boxShadow: "8px 16px 24px -8px rgba(0, 0, 0, 0.60)",
        zIndex: props.isVisible ? 9999 : -1,
        opacity: props.isVisible ? 1.0 : 0.0,
      }}
    >
      <div className="grow flex flex-col p-2 bg-darker/20">
        {/* Sidebar Operations */}
        <div className="w-full flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <Button transparent onClick={props.collapse}>
              <TbLayoutSidebarLeftCollapse size={28} />
            </Button>
          </div>
          <Button
            transparent
            onClick={() =>
              new WebviewWindow("intents", config.webviews.intents)
            }
          >
            <MdOpenInNew size={28} />
          </Button>
        </div>
        {/* Content */}
        <div className="grow flex flex-col gap-1">
          {store.activeIntentId ? (
            <div className="">Intent details</div>
          ) : (
            <>
              {tab === "intents" ? (
                <>
                  {store.intents.length > 0 ? (
                    <IntentsList
                      data={store.intents.filter(
                        (intent) =>
                          intent.archived_at === null ||
                          intent.archived_at === undefined
                      )}
                      selectedIntentId={store.activeIntentId}
                      selectedTags={selectedIntentTags}
                      onSelected={onIntentChange}
                      onTagSelected={(data) => setSelectedIntentTags(data)}
                    />
                  ) : (
                    <div className="m-auto text-sm text-text/80 text-center">
                      <p>There are no defined intents</p>
                    </div>
                  )}
                </>
              ) : null}
              {tab === "queue" ? <QueueView /> : null}
              {/* Content Navigation */}
              <div className="h-7 flex flex-row gap-0.5 rounded-sm overflow-clip">
                <Button
                  rounded={false}
                  style={{
                    width: tab === "intents" ? "100%" : "fit-content",
                  }}
                  color={tab === "intents" ? "primary" : "base"}
                  onClick={() => setTab("intents")}
                >
                  <BiTargetLock size={24} />
                  {tab === "intents" ? <span>Intents</span> : undefined}
                </Button>
                <Button
                  rounded={false}
                  style={{
                    width: tab === "queue" ? "100%" : "fit-content",
                  }}
                  color={tab === "queue" ? "primary" : "base"}
                  onClick={() => setTab("queue")}
                >
                  <QueueIcon size={24} />
                  {tab === "queue" ? <span>Queue</span> : undefined}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const QueueView: React.FC = () => {
  return <div className="grow flex flex-col">Queue</div>;
};

export default Sidebar;
