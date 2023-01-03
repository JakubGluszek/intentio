import React from "react";
import {
  MdClose,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import { BsArrowsCollapse, BsArrowsExpand } from "react-icons/bs";
import clsx from "clsx";
import { useAutoAnimate } from "@formkit/auto-animate/react";

import { Session } from "@/bindings/Session";
import Button from "@/components/Button";
import { DayDetail } from "@/types";
import { Intent } from "@/bindings/Intent";

interface Props {
  intents: Intent[];
  sessions: Session[];
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

const TimelineView: React.FC<Props> = (props) => {
  const [skip, setSkip] = React.useState(0);
  const [limit, setLimit] = React.useState(25);

  const [parent] = useAutoAnimate<HTMLDivElement>();
  const [collapseAll, setCollapseAll] = React.useState(false);

  const handleFilter = (s: DayDetail): DayDetail | undefined => {
    if (props.filter.length === 0) return s;

    const [fYear, fMonth, fDay] = props.filter.split("-");

    if (!fDay || !fMonth || !fYear) return undefined;

    const [year, month, day] = s.date.split("-");

    if (fDay !== "*" && fDay !== day) {
      return undefined;
    } else if (fMonth !== "*" && fMonth !== month) {
      return undefined;
    } else if (fYear !== "*" && fYear !== year) {
      return undefined;
    }

    return s;
  };

  const days = React.useMemo(() => {
    let days: Map<string, DayDetail> = new Map();
    // group sessions by day
    for (let i = 0; i < props.sessions.length; i++) {
      const date = new Date(parseInt(props.sessions[i].finished_at));

      const iso_date = date.toISOString().split("T")[0];

      const day = days.get(iso_date);
      if (day) {
        day.duration += props.sessions[i].duration / 60;
        day.sessions?.push(props.sessions[i]);
      } else {
        days.set(iso_date, {
          duration: props.sessions[i].duration / 60,
          date: iso_date,
          sessions: [props.sessions[i]],
        });
      }
    }

    return Array.from(days.values()).filter(handleFilter);
  }, [props.sessions, props.filter]);

  return (
    <div className="grow flex flex-col gap-2 animate-in fade-in-0 duration-75">
      {/* Header */}
      <div className="h-8 flex flex-row items-center gap-2">
        <div className="relative w-full flex flex-row items-center gap-1">
          <input
            autoComplete="off"
            value={props.filter}
            onChange={(e) => props.setFilter(e.currentTarget.value)}
            className="pr-8"
            placeholder="Filter by date, e.g. 2022-11-*"
            type="text"
          />
          {props.filter.length > 0 && (
            <div className="absolute bottom-[5px] right-2 animate-in fade-in scale-90">
              <Button
                transparent
                onClick={() => {
                  props.setFilter("");
                }}
              >
                <MdClose size={24} />
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-row items-center gap-2">
          <Button transparent onClick={() => setCollapseAll((prev) => !prev)}>
            {collapseAll ? (
              <BsArrowsCollapse size={24} />
            ) : (
              <BsArrowsExpand size={24} />
            )}
          </Button>
        </div>
      </div>
      {/* Body */}
      <div className="grow flex flex-col overflow-y-auto">
        <div className="grow flex flex-col overflow-y-auto">
          {days.length > 0 ? (
            <div
              ref={parent}
              className="w-full max-h-0 flex flex-col gap-1 overflow-y"
            >
              {days.slice(skip, limit).map((day) => (
                <DayView key={day.date} data={day} collapse={collapseAll} />
              ))}
            </div>
          ) : (
            <div className="m-auto text-sm text-text/80 text-center">
              There are no saved sessions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface DayViewProps {
  data: DayDetail;
  collapse: boolean;
}

const DayView: React.FC<DayViewProps> = (props) => {
  const { data } = props;

  const [viewMore, setViewMore] = React.useState(false);

  React.useEffect(() => {
    setViewMore(props.collapse);
  }, [props.collapse]);

  return (
    <div className="flex flex-col p-1 transition-color rounded shadow bg-window">
      <div
        className={clsx(
          "h-8 w-full flex flex-row items-center justify-between"
        )}
      >
        <span className="text-lg text-text/80">{data.date}</span>
        <Button
          tabIndex={-1}
          transparent
          onClick={() => setViewMore((v) => !v)}
        >
          {viewMore ? (
            <MdKeyboardArrowUp size={28} />
          ) : (
            <MdKeyboardArrowDown size={28} />
          )}
        </Button>
      </div>
      {viewMore ? (
        <div className="flex flex-col p-2 bg-window/80 rounded">
          <h1>More</h1>
        </div>
      ) : null}
    </div>
  );
};

export default TimelineView;
