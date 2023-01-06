import React from "react";
import { TiPin, TiPinOutline } from "react-icons/ti";
import { MdInfo } from "react-icons/md";
import { useClickOutside } from "@mantine/hooks";
import { useForm } from "react-hook-form";

import services from "@/app/services";
import Button from "@/components/Button";
import { Session } from "@/bindings/Session";
import { Intent } from "@/bindings/Intent";
import DetailsModal from "./DetailsModal";
import ActivityView from "./ActivityView";
import SessionsView from "./SessionsView";

interface Props {
  data: Intent;
  sessions: Session[];
}

type Tab = "activity" | "sessions" | "tasks" | "notes";

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
      {viewDetails ? (
        <DetailsModal data={data} exit={() => setViewDetails(false)} />
      ) : null}
      {/* Heading */}
      <div className="w-full h-7 flex flex-row items-center justify-between gap-2">
        <div className="w-full overflow-hidden">
          <IntentLabelView
            label={data.label}
            update={async (label) => services.updateIntent(data.id, { label })}
          />
        </div>
        <div className="min-w-fit flex flex-row items-center gap-1">
          <PinButton
            isPinned={data.pinned}
            onClick={() =>
              services.updateIntent(data.id, { pinned: !data.pinned })
            }
          />
          <Button transparent onClick={() => setViewDetails(!viewDetails)}>
            <MdInfo size={28} />
          </Button>
        </div>
      </div>

      {/* Main */}
      <div className="relative grow flex flex-col bg-darker/20 rounded inner-shadow overflow-clip">
        {/* Tab content */}
        <div className="grow flex flex-col justify-evenly p-2">
          {tab === "activity" ? (
            <ActivityView
              sessions={props.sessions}
              viewDayDetails={(date: string) => {
                switchTab("sessions");
                setFilter(date);
              }}
            />
          ) : null}
          {tab === "sessions" ? (
            <SessionsView
              sessions={props.sessions}
              filter={filter}
              setFilter={(label: string) => setFilter(label)}
            />
          ) : null}
          {tab === "tasks" ? <TasksView /> : null}
          {tab === "notes" ? <NotesView /> : null}
        </div>
      </div>
      {/* Tab navigation */}
      <div className="w-full h-7 flex flex-row gap-0.5 rounded-sm overflow-clip text-sm">
        <Button
          style={{
            width: tab === "activity" ? "100%" : "fit-content",
          }}
          opacity={tab !== "activity" ? 0.5 : undefined}
          rounded={false}
          onClick={() => switchTab("activity")}
        >
          Activity
        </Button>
        <Button
          style={{
            width: tab === "tasks" ? "100%" : "fit-content",
          }}
          opacity={tab !== "tasks" ? 0.5 : undefined}
          rounded={false}
          onClick={() => switchTab("tasks")}
        >
          Tasks
        </Button>
        <Button
          style={{
            width: tab === "notes" ? "100%" : "fit-content",
          }}
          opacity={tab !== "notes" ? 0.5 : undefined}
          rounded={false}
          onClick={() => switchTab("notes")}
        >
          Notes
        </Button>
        <Button
          style={{
            width: tab === "sessions" ? "100%" : "fit-content",
          }}
          opacity={tab !== "sessions" ? 0.5 : undefined}
          rounded={false}
          onClick={() => switchTab("sessions")}
        >
          Sessions
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
      transparent
      onClick={(e) => {
        props.onClick(e);
        setIsAnimation(true);
      }}
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
      <input
        autoFocus
        maxLength={24}
        {...register("label", { required: true, minLength: 1, maxLength: 24 })}
      />
    </form>
  ) : (
    <h1
      data-tauri-disable-drag
      className="whitespace-nowrap overflow-ellipsis overflow-hidden text-lg"
      onClick={() => setViewEdit(true)}
    >
      {props.label}
    </h1>
  );
};

const TasksView: React.FC = () => {
  return <div className="grow flex flex-col gap-2">Tasks</div>;
};

const NotesView: React.FC = () => {
  return <div className="grow flex flex-col gap-2">Notes</div>;
};

export default IntentView;
