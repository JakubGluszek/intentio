import React from "react";
import { TiPin, TiPinOutline } from "react-icons/ti";
import { MdInfo } from "react-icons/md";
import { useClickOutside } from "@mantine/hooks";
import { useForm } from "react-hook-form";

import ipc from "@/ipc";
import { Session } from "@/bindings/Session";
import { Intent } from "@/bindings/Intent";
import DetailsModal from "./DetailsModal";
import ActivityView from "./ActivityView";
import TimelineView from "./TimelineView";
import { Button, Input } from "@/ui";

interface Props {
  data: Intent;
  sessions: Session[];
}

type Tab = "activity" | "timeline";

const IntentView: React.FC<Props> = (props) => {
  const { data } = props;

  const [tab, setTab] = React.useState<Tab>("activity");
  const [viewDetails, setViewDetails] = React.useState(false);
  // string to filter sessions by label inside the "sessions" tab
  const [filter, setFilter] = React.useState("");

  const switchTab = (tab: Tab) => {
    setViewDetails(false);
    setTab(tab);
  };

  return (
    <div className="grow flex flex-col gap-2 p-2">
      <DetailsModal
        display={viewDetails}
        data={data}
        exit={() => setViewDetails(false)}
      />
      {/* Heading */}
      <div className="w-full h-7 flex flex-row items-center justify-between gap-2">
        <div className="w-full overflow-hidden">
          <IntentLabelView
            label={data.label}
            update={async (label) => ipc.updateIntent(data.id, { label })}
          />
        </div>
        <div className="min-w-fit flex flex-row items-center gap-1">
          <PinButton
            isPinned={data.pinned}
            onClick={() => ipc.updateIntent(data.id, { pinned: !data.pinned })}
          />
          <Button onClick={() => setViewDetails(!viewDetails)} variant="ghost">
            <MdInfo size={28} />
          </Button>
        </div>
      </div>

      {/* Main */}
      <div className="relative grow flex flex-col bg-darker/40 rounded shadow-inner overflow-clip">
        {/* Tab content */}
        <div className="grow flex flex-col justify-evenly p-2">
          {tab === "activity" ? (
            <ActivityView
              sessions={props.sessions}
              viewDayDetails={(date: string) => {
                switchTab("timeline");
                setFilter(date);
              }}
            />
          ) : null}
          {tab === "timeline" ? (
            <TimelineView
              intentId={props.data.id}
              sessions={props.sessions}
              filter={filter}
              setFilter={(label: string) => setFilter(label)}
            />
          ) : null}
        </div>
      </div>
      {/* Tab navigation */}
      <div className="w-full h-7 flex flex-row gap-0.5 rounded-sm overflow-clip text-sm">
        <Button
          onClick={() => switchTab("activity")}
          variant="ghost"
          style={{
            width: tab === "activity" ? "100%" : "fit-content",
          }}
        >
          Activity
        </Button>
        <Button
          onClick={() => switchTab("timeline")}
          style={{
            width: tab === "timeline" ? "100%" : "fit-content",
          }}
          variant="ghost"
        >
          Timeline
        </Button>
      </div>
    </div>
  );
};

interface PinButtonProps {
  onClick: React.MouseEventHandler;
  isPinned: boolean;
}

const PinButton: React.FC<PinButtonProps> = (props) => {
  const [isAnimation, setIsAnimation] = React.useState(false);

  React.useEffect(() => {
    let animationTimeout: NodeJS.Timeout | undefined;

    if (isAnimation) {
      animationTimeout = setTimeout(() => setIsAnimation(false), 900);
    } else {
      clearTimeout(animationTimeout);
    }

    return () => clearTimeout(animationTimeout);
  }, [isAnimation]);

  return (
    <Button
      onClick={(e) => {
        props.onClick(e);
        setIsAnimation(true);
      }}
      variant="ghost"
      animate={
        isAnimation
          ? {
            rotateZ: [-20, 20, -10, 10, -5, 5, 0],
          }
          : { rotateZ: 0 }
      }
      transition={{
        duration: 0.9,
        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      }}
    >
      {props.isPinned ? <TiPin size={28} /> : <TiPinOutline size={28} />}
    </Button>
  );
};

interface IntentLabelViewProps {
  label: string;
  update: (label: string) => void;
}

const IntentLabelView: React.FC<IntentLabelViewProps> = (props) => {
  const [viewEdit, setViewEdit] = React.useState(false);

  const { register, handleSubmit, setValue } = useForm<{ label: string }>();
  const ref = useClickOutside(() => setViewEdit(false));

  const onSubmit = handleSubmit(({ label }) => {
    props.update(label);
    setViewEdit(false);
  });

  React.useEffect(() => {
    setValue("label", props.label);
  }, []);

  return viewEdit ? (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      ref={ref}
    >
      <Input
        autoFocus
        maxLength={24}
        {...register("label", { required: true, minLength: 1, maxLength: 24 })}
      />
    </form>
  ) : (
    <h1
      data-tauri-disable-drag
      className="w-fit whitespace-nowrap overflow-ellipsis overflow-hidden text-lg"
      onDoubleClick={() => setViewEdit(true)}
    >
      {props.label}
    </h1>
  );
};

export default IntentView;
