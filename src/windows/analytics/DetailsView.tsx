import React from "react";
import autoAnimate from "@formkit/auto-animate";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { IoMdCalendar, IoMdTime } from "react-icons/io";
import {
  MdClose,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";

import useGlobal from "../../app/store";
import { DayDetail } from "../../types";
import Button from "../../components/Button";

interface Props {
  filter: string;
  setFilter: React.Dispatch<React.SetStateAction<string>>;
}

const DETAILS_PAGINATION = 14;

const DetailsView: React.FC<Props> = ({ filter, setFilter }) => {
  const sessions = useGlobal((state) => state.sessions);
  const [limit, setLimit] = React.useState(DETAILS_PAGINATION);

  const [parent] = useAutoAnimate<HTMLDivElement>();

  const handleFilter = (s: DayDetail): DayDetail | undefined => {
    if (filter.length === 0) return s;

    const [fYear, fMonth, fDay] = filter.split("-");

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
    const days: Map<string, DayDetail> = new Map();
    // group sessions by day
    for (let i = 0; i < sessions.length; i++) {
      const date = new Date(parseInt(sessions[i].finished_at));

      const iso_date = date.toISOString().split("T")[0];

      const day = days.get(iso_date);
      if (day) {
        day.duration += sessions[i].duration / 60;
        day.sessions?.push(sessions[i]);
      } else {
        days.set(iso_date, {
          duration: sessions[i].duration / 60,
          date: iso_date,
          sessions: [sessions[i]],
        });
      }
    }

    return days;
  }, [sessions]);

  const days_arr = Array.from(days.values()).filter(handleFilter);
  return (
    <div className="flex flex-col gap-4">
      {/* Filter by date */}
      <div className="relative">
        <input
          autoComplete="off"
          value={filter}
          onChange={(e) => setFilter(e.currentTarget.value)}
          placeholder="Filter by date, e.g. 2022-11-*"
          type="text"
          className="input"
        />
        {filter.length > 0 && (
          <div className="absolute bottom-0 right-2 animate-in fade-in scale-90">
            <Button
              transparent
              onClick={() => {
                setFilter("");
                setLimit(DETAILS_PAGINATION);
              }}
            >
              <MdClose size={24} />
            </Button>
          </div>
        )}
      </div>
      {/* Days */}
      <div ref={parent} className="flex flex-col gap-2">
        {days_arr.slice(0, limit).map((d) => (
          <DetailsDayView key={d.date} data={d} />
        ))}
      </div>
      {limit < days_arr.length && (
        <Button
          transparent
          onClick={() =>
            setLimit(
              limit + DETAILS_PAGINATION <= days_arr.length
                ? limit + DETAILS_PAGINATION
                : days_arr.length
            )
          }
        >
          Load more
        </Button>
      )}
    </div>
  );
};

interface DetailsDayViewProps {
  data: DayDetail;
}

const DetailsDayView: React.FC<DetailsDayViewProps> = ({ data }) => {
  const [viewSessions, setViewSessions] = React.useState(false);

  const getProjectById = useGlobal((state) => state.getProjectById);

  const parent = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  return (
    <div ref={parent} className="flex flex-col gap-2 bg-base rounded p-2">
      {/* Detail */}
      <div className="flex flex-row items-center justify-between text-lg">
        <div className="flex-1 flex flex-row items-center justify-center gap-2">
          <IoMdCalendar size={24} />
          <span>{data.date}</span>
        </div>
        <div className="flex-1 flex flex-row items-center justify-center gap-2">
          <IoMdTime size={24} />
          <span>{data.duration.toFixed(2)}h</span>
        </div>
        <Button transparent onClick={() => setViewSessions(!viewSessions)}>
          {viewSessions ? (
            <MdKeyboardArrowUp size={24} />
          ) : (
            <MdKeyboardArrowDown size={24} />
          )}
        </Button>
      </div>
      {/* Sessions */}
      {viewSessions && (
        <div className="flex flex-col gap-1">
          {data.sessions?.map((s) => (
            <div key={s.id} className="flex flex-row bg-window rounded p-1">
              <div className="flex-1 text-center">
                {getProjectById(s.project_id)?.name ?? "-"}
              </div>
              <div className="flex-1 text-center">{s.duration} min</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DetailsView;
