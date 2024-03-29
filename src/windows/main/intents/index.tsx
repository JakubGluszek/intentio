import React from "react";
import { MdAddCircle, MdInfo, MdSettings, MdTag } from "react-icons/md";
import { RiArchiveFill, RiArchiveLine } from "react-icons/ri";
import { BiTargetLock } from "react-icons/bi";

import { Button, IconView, ScrollArea } from "@/ui";
import { useIntent, useIntents, useTimer } from "@/hooks";
import { ModelId } from "@/types";
import { Intent } from "@/bindings/Intent";

import { CreateIntentModal } from "./CreateIntentModal";
import { TagsModal } from "./TagsModal";
import { IntentConfigModal } from "./IntentConfigModal";
import { clsx } from "@mantine/core";
import { MainWindowContext } from "../mainWindowContext";

export const IntentsView: React.FC = () => {
  const [viewArchive, setViewArchive] = React.useState(false);
  const [viewCreate, setViewCreate] = React.useState(false);
  const [viewTags, setViewTags] = React.useState(false);
  const [viewIntentConfig, setViewIntentConfig] =
    React.useState<ModelId | null>(null);

  const { setDisplayNavbar } = React.useContext(MainWindowContext)!;

  const intents = useIntents();
  const timer = useTimer();

  React.useEffect(() => {
    setDisplayNavbar(true);
  }, []);

  return (
    <>
      {/* Navbar */}
      <nav className="h-8 flex flex-row gap-0.5 rounded-[1px] overflow-clip">
        {/* Heading */}
        <div className="flex-1 flex flex-row items-center gap-1 px-1 text-text/80 bg-base/5 border border-base/5">
          <span className="font-bold uppercase text-lg">
            {viewArchive ? "Archive" : "Intents"}
          </span>
        </div>

        {/* Button Bar */}
        <div className="w-fit flex flex-row items-center px-2 gap-2 bg-base/5 border border-base/5">
          <Button onClick={() => setViewCreate(true)} variant="ghost">
            <IconView icon={MdAddCircle} />
          </Button>
          <Button onClick={() => setViewTags(true)} variant="ghost">
            <IconView icon={MdTag} />
          </Button>
          <Button
            onClick={() => setViewArchive((prev) => !prev)}
            variant="ghost"
          >
            {viewArchive ? (
              <IconView icon={RiArchiveFill} />
            ) : (
              <IconView icon={RiArchiveLine} />
            )}
          </Button>
        </div>
      </nav>

      <IntentsList
        data={intents.data}
        viewArchive={viewArchive}
        onConfigureIntent={setViewIntentConfig}
        selected={timer.session?.intent}
        onSelected={timer.setIntent}
      />

      <CreateIntentModal
        display={viewCreate}
        onCreate={intents.create}
        onExit={() => setViewCreate(false)}
      />
      <TagsModal display={viewTags} onExit={() => setViewTags(false)} />
      <IntentConfigModal
        intentId={viewIntentConfig}
        onExit={() => setViewIntentConfig(null)}
      />
    </>
  );
};

interface IntentsListProps {
  data: Intent[];
  viewArchive: boolean;
  onConfigureIntent: (id: ModelId) => void;
  selected: Intent | undefined;
  onSelected: (intent: Intent) => void;
}

const IntentsList: React.FC<IntentsListProps> = (props) => {
  // TODO: Sort intents by total session hours
  return (
    <ScrollArea>
      <div className="flex flex-col gap-0.5">
        {props.data
          .filter((intent) => !!intent.archived_at === props.viewArchive)
          .map((intent) => (
            <IntentView
              key={intent.id}
              id={intent.id}
              onConfigure={props.onConfigureIntent}
              onClick={() => props.onSelected(intent)}
              selected={props.selected?.id === intent.id}
            />
          ))}
      </div>
    </ScrollArea>
  );
};

interface IntentViewProps {
  id: ModelId;
  onConfigure: (id: ModelId) => void;
  onClick: () => void;
  selected: boolean;
}

const IntentView: React.FC<IntentViewProps> = (props) => {
  const intent = useIntent(props.id);

  if (!intent.data) return null;

  return (
    <div
      className={clsx(
        "group h-fit flex flex-col gap-1 p-1 cursor-pointer transition-all duration-300 hover:shadow-black/25 hover:shadow active:shadow-black/25 active:shadow-lg",
        props.selected
          ? "bg-primary/10 hover:bg-primary/20 border-b-2 border-primary/80"
          : "bg-base/10 hover:bg-primary/10 active:bg-primary/20 border-b-2 border-transparent"
      )}
      // @ts-ignore
      onClick={(e) => !e.target.closest("button") && props.onClick()}
      data-tauri-disable-drag
    >
      {/* Heading */}
      <div className="flex flex-row items-center justify-between">
        {/* Label */}
        <div
          className={clsx(
            "flex flex-row items-center gap-1 transition-colors duration-300",
            props.selected
              ? "text-primary/80 grup-hover:text-primary"
              : "text-text/70 group-hover:text-text"
          )}
        >
          <IconView icon={BiTargetLock} />
          <span className="font-bold">{intent.data.label}</span>
        </div>
        <div className="flex flex-row gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button variant="ghost">
            <IconView icon={MdInfo} />
          </Button>
          <Button
            onClick={() => props.onConfigure(intent.data!.id)}
            variant="ghost"
          >
            <IconView icon={MdSettings} />
          </Button>
        </div>
      </div>
      {intent.tags.length > 0 && (
        <div className="w-full flex flex-row overflow-x-auto gap-0.5 p-0.5 bg-window/50 rounded-md">
          {intent.tags.map((tag) => (
            <div
              key={tag.id}
              className="flex flex-row items-center px-1 rounded bg-primary/20 cursor-default hover:bg-primary/30 text-primary/80 hover:text-primary transition-all duration-300"
            >
              <IconView icon={MdTag} />
              <span className="uppercase text-sm font-bold">{tag.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
