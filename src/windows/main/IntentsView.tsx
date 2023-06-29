import React from "react";
import { MdAddCircle, MdInfo, MdSettings, MdTag } from "react-icons/md";
import { HiArchive } from "react-icons/hi";
import { BiTargetLock } from "react-icons/bi";

import { Button, IconView, ScrollArea } from "@/ui";
import { useIntents } from "@/hooks";
import { Intent } from "@/bindings/Intent";
import { MainWrapper } from "./MainWrapper";
import { CreateIntentModal } from "./CreateIntentModal";
import { TagsModal } from "./TagsModal";

export const IntentsView: React.FC = () => {
  const [viewCreate, setViewCreate] = React.useState(false);
  const [viewTags, setViewTags] = React.useState(false);

  const intents = useIntents();

  return (
    <>
      <MainWrapper>
        {/* Navbar */}
        <div className="h-8 flex flex-row gap-0.5 rounded-[1px] overflow-clip">
          {/* Heading */}
          <div className="flex-1 flex flex-row items-center gap-1 px-2 text-text/80 bg-base/5">
            <IconView icon={MdInfo} />
            <span className="font-bold uppercase text-lg">Intents</span>
          </div>

          {/* Button Bar */}
          <div className="w-fit flex flex-row items-center px-2 gap-2 bg-base/5">
            <Button
              onClick={() => setViewCreate(true)}
              variant="ghost"
              config={{ ghost: { highlight: false } }}
            >
              <IconView icon={MdAddCircle} />
            </Button>
            <Button
              onClick={() => setViewTags(true)}
              variant="ghost"
              config={{ ghost: { highlight: false } }}
            >
              <IconView icon={MdTag} />
            </Button>
            <Button variant="ghost" config={{ ghost: { highlight: false } }}>
              <IconView icon={HiArchive} />
            </Button>
          </div>
        </div>

        <div className="grow flex flex-col bg-base/5 p-1">
          <IntentsList data={intents.data} />
        </div>
      </MainWrapper>

      <CreateIntentModal
        display={viewCreate}
        onCreate={intents.create}
        onExit={() => setViewCreate(false)}
      />
      <TagsModal display={viewTags} onExit={() => setViewTags(false)} />
    </>
  );
};

interface IntentsListProps {
  data: Intent[];
}

const IntentsList: React.FC<IntentsListProps> = (props) => {
  // TODO: Sort intents by total session hours
  return (
    <ScrollArea>
      <div className="flex flex-col gap-1">
        {props.data.map((intent) => (
          <IntentView key={intent.id} data={intent} />
        ))}
      </div>
    </ScrollArea>
  );
};

interface IntentViewProps {
  data: Intent;
}

const IntentView: React.FC<IntentViewProps> = (props) => {
  // TODO: Query associated tags
  return (
    <div
      className="group h-fit flex flex-col gap-1 p-1 bg-base/5 hover:bg-primary/10 active:bg-primary/20 border border-base/5 active:border-transparent rounded-sm cursor-pointer transition-all duration-300 hover:shadow-black/25 hover:shadow active:shadow-black/25 active:shadow-lg"
      data-tauri-disable-drag
    >
      {/* Heading */}
      <div className="flex flex-row items-center justify-between">
        {/* Label */}
        <div className="flex flex-row items-center gap-1 text-text/80">
          <IconView icon={BiTargetLock} />
          <span className="font-bold">{props.data.label}</span>
        </div>
        <div className="flex flex-row gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button variant="ghost" config={{ ghost: { highlight: false } }}>
            <IconView icon={MdInfo} />
          </Button>
          <Button variant="ghost" config={{ ghost: { highlight: false } }}>
            <IconView icon={MdSettings} />
          </Button>
        </div>
      </div>
      <div className="w-full flex flex-row gap-0.5 p-0.5 bg-window/50 rounded-md">
        <div className="flex flex-row items-center px-1 rounded bg-primary/20 hover:bg-primary/30 text-primary/80 hover:text-primary active:bg-primary active:text-window transition-all duration-300">
          <IconView icon={MdTag} />
          <span className="uppercase text-sm font-bold">Dummy</span>
        </div>
        <div className="flex flex-row items-center px-1 rounded bg-primary/20 hover:bg-primary/30 text-primary/80 hover:text-primary active:bg-primary active:text-window transition-all duration-300">
          <IconView icon={MdTag} />
          <span className="uppercase text-sm font-bold">Dummy 2</span>
        </div>
      </div>
    </div>
  );
};
