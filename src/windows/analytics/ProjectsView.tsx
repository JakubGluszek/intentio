import React from "react";
import autoAnimate from "@formkit/auto-animate";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  MdClose,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import { Project } from "../../bindings/Project";

import useGlobal from "../../app/store";
import { DayDetail } from "../../types";
import Button from "../../components/Button";

const ProjectsView: React.FC = () => {
  const [filter, setFilter] = React.useState("");

  const projects = useGlobal((state) => state.projects);

  const [parent] = useAutoAnimate<HTMLDivElement>();

  return (
    <div className="flex flex-col gap-4">
      {/* Filter by name */}
      <div className="relative">
        <input
          autoComplete="off"
          value={filter}
          onChange={(e) => setFilter(e.currentTarget.value)}
          placeholder="Filter by name"
          type="text"
          className="input"
        />
        {filter.length > 0 && (
          <div className="absolute top-[25%] bottom-[25%] right-2 animate-in fade-in scale-90">
            <Button transparent onClick={() => setFilter("")}>
              <MdClose size={24} />
            </Button>
          </div>
        )}
      </div>
      {/* Projects */}
      <div ref={parent} className="flex flex-col gap-2">
        {projects
          .filter((p) => p.name.toLowerCase().includes(filter.toLowerCase()))
          .map((p) => (
            <ProjectView key={p.id} data={p} />
          ))}
      </div>
    </div>
  );
};

interface ProjectViewProps {
  data: Project;
}

const DAYS_PAGINATION = 30;

const ProjectView: React.FC<ProjectViewProps> = ({ data }) => {
  const [viewDetails, setViewDetails] = React.useState(false);
  const [limit, setLimit] = React.useState(DAYS_PAGINATION);

  const sessions = useGlobal((state) => state.getSessionsByProjectId)(data.id);

  const days = React.useMemo(() => {
    let days: Map<string, DayDetail> = new Map();
    // group sessions by day
    for (let i = 0; i < sessions.length; i++) {
      let date = new Date(parseInt(sessions[i].finished_at));

      let iso_date = date.toISOString().split("T")[0];

      let day = days.get(iso_date);
      if (day) {
        day.duration += sessions[i].duration / 60;
      } else {
        days.set(iso_date, {
          duration: sessions[i].duration / 60,
          date: iso_date,
        });
      }
    }

    return days;
  }, [sessions]);

  const parent = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const days_arr = Array.from(days.values());

  return (
    <div ref={parent} className="flex flex-col gap-2 bg-base rounded p-2">
      {/* Header */}
      <div className="flex flex-row items-center justify-between text-lg">
        <div className="flex-1 flex flex-row items-center justify-between gap-2">
          <span>{data.name}</span>
          <span className="px-4">
            {(
              sessions
                .filter((s) => s.project_id === data.id)
                .reduce((c, p) => (c += p.duration), 0) / 60
            ).toFixed(2)}
            h
          </span>
        </div>
        <Button transparent onClick={() => setViewDetails(!viewDetails)}>
          {viewDetails ? (
            <MdKeyboardArrowUp size={24} />
          ) : (
            <MdKeyboardArrowDown size={24} />
          )}
        </Button>
      </div>
      {/* Sessions */}
      {viewDetails && (
        <div className="flex flex-col gap-1">
          {days_arr.length > 0 ? (
            days_arr.slice(0, limit).map((day) => (
              <div
                key={day.date}
                className="flex flex-row bg-window rounded p-1"
              >
                <div className="flex-1 text-center">{day.date}</div>
                <div className="flex-1 text-center">
                  {day.duration.toFixed(2)}h
                </div>
              </div>
            ))
          ) : (
            <p className="text-center">None</p>
          )}
          {limit < days_arr.length && (
            <Button
              transparent
              onClick={() =>
                setLimit(
                  limit + DAYS_PAGINATION <= days_arr.length
                    ? limit + DAYS_PAGINATION
                    : days_arr.length
                )
              }
            >
              Load more
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectsView;
