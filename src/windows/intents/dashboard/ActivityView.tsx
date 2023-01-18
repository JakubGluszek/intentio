import React from "react";
import { MdToday } from "react-icons/md";
import { IoMdTime } from "react-icons/io";
import { AiFillFire } from "react-icons/ai";
import Color from "color";
import ActivityCalendar, { Day } from "react-activity-calendar";
import ReactTooltip from "react-tooltip";

import { formatTime } from "@/utils";
import { Session } from "@/bindings/Session";
import { Intent } from "@/bindings/Intent";
import useStore from "@/store";

interface Props {
  intents: Intent[];
  tags: string[];
  sessions: Session[];
  viewDayDetails: (date: string) => void;
}

const ActivityView: React.FC<Props> = (props) => {
  return (
    <div className="grow flex flex-col justify-evenly">
      <SummaryView
        sessions={props.sessions}
        tags={props.tags}
        intents={props.intents}
      />
      <CalendarView
        sessions={props.sessions}
        tags={props.tags}
        intents={props.intents}
        viewDayDetails={props.viewDayDetails}
      />
    </div>
  );
};

interface SummaryViewProps {
  intents: Intent[];
  tags: string[];
  sessions: Session[];
}

const SummaryView: React.FC<SummaryViewProps> = (props) => {
  const today = new Date();

  const totalFocused = React.useMemo(
    () => props.sessions.reduce((p, c) => p + c.duration, 0) / 60,
    [props.sessions]
  );

  const focusedToday = React.useMemo(
    () =>
      props.sessions
        .filter(
          (s) =>
            new Date(parseInt(s.finished_at)).toDateString() ==
            today.toDateString()
        )
        .reduce((p, c) => p + c.duration, 0) / 60,
    [props.sessions]
  );

  const dayStreak = React.useMemo(() => {
    let dayStreak = 1;

    const sorted = props.sessions.sort(
      (a, b) => parseInt(b.finished_at) - parseInt(a.finished_at)
    );
    let prevDay = new Date();
    // there might be timezone related issues
    for (let i = 0; i < sorted.length; i++) {
      const s = sorted[i];
      const date = new Date(parseInt(s.finished_at));

      if (date.toDateString() === prevDay.toDateString()) continue;
      date.setDate(date.getDate() + 1);

      if (date.toDateString() === prevDay.toDateString()) {
        dayStreak += 1;
        prevDay = new Date(parseInt(s.finished_at));
      } else {
        break;
      }
    }

    return dayStreak;
  }, [props.sessions]);

  return (
    <div className="flex flex-col rounded gap-4 pt-1">
      <h1 className="text-primary/80 text-center font-semibold">
        {`SUMMARY OF ${props.tags.length === 0
            ? "ALL ACTIVITY"
            : props.intents.length === 1
              ? "1 INTENT"
              : `${props.intents.length} INTENTS`
          }`}
      </h1>
      <div className="w-full flex flex-row gap-1">
        {/* Total time focused */}
        <div className="w-full flex flex-col items-center gap-2">
          <div className="w-full flex flex-row items-center justify-center gap-1">
            <IoMdTime className="text-primary/80" size={28} />
            <span className="text-lg">Total</span>
          </div>
          <div className="bg-window border-b-2 border-primary/80 w-full flex flex-col items-center justify-center rounded px-1 py-4 shadow">
            <span>{formatTime(totalFocused * 60)}</span>
          </div>
        </div>
        {/* Today's focused time */}
        <div className="w-full flex flex-col items-center gap-2">
          <div className="w-full flex flex-row items-center justify-center gap-1">
            <MdToday className="text-primary/80" size={26} />
            <span className="text-lg">Today</span>
          </div>
          <div className="bg-window border-b-2 border-primary/80 w-full flex flex-col items-center justify-center rounded px-1 py-4 shadow">
            <span>{formatTime(focusedToday * 60)}</span>
          </div>
        </div>
        {/* Day Streak */}
        <div className="w-full flex flex-col items-center gap-2">
          <div className="flex flex-row items-center justify-center gap-1">
            <AiFillFire className="text-primary/80" size={28} />
            <span className="text-lg">Streak</span>
          </div>
          <div className="bg-window border-b-2 border-primary/80 w-full flex flex-col items-center justify-center rounded px-1 py-4 shadow">
            <span>
              {dayStreak} {dayStreak === 1 ? "day" : "days"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CalendarViewProps {
  sessions: Session[];
  intents: Intent[];
  tags: string[];
  viewDayDetails: (date: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = (props) => {
  const currentTheme = useStore((state) => state.currentTheme);

  const days = React.useMemo(() => {
    const days: Map<string, Day> = new Map();

    // sessions date range
    const dateRange = new Date();
    dateRange.setMonth(dateRange.getMonth() - 5);

    // transform sessions to appropriate Date objects
    for (let i = 0; i < props.sessions.length; i++) {
      const date = new Date(parseInt(props.sessions[i].finished_at));

      if (date.getTime() < dateRange.getTime()) continue;

      const iso_date = date.toISOString().split("T")[0];

      const day = days.get(iso_date);
      if (day) {
        day.count += props.sessions[i].duration / 60;
      } else {
        days.set(iso_date, {
          count: props.sessions[i].duration / 60,
          date: iso_date,
          level: 1,
        });
      }
    }

    // dummy objects needed in order to render graph properly
    const range_iso = dateRange.toISOString().split("T")[0];
    if (!days.has(range_iso)) {
      days.set(range_iso, { date: range_iso, count: 0, level: 0 });
    }
    const today_iso = new Date().toISOString().split("T")[0];
    if (!days.has(today_iso)) {
      days.set(today_iso, { date: today_iso, count: 0, level: 0 });
    }

    const days_array = Array.from(days.values());

    // level assigment based on hours spent
    // "count" equals "hours" in this case
    for (let i = 0; i < days_array.length; i++) {
      if (days_array[i].count >= 8) {
        days_array[i].level = 4;
      } else if (days_array[i].count >= 6) {
        days_array[i].level = 3;
      } else if (days_array[i].count >= 3) {
        days_array[i].level = 2;
      } else if (days_array[i].count > 0) {
        days_array[i].level = 1;
      } else {
        days_array[i].level = 0;
      }

      // needed for tooltip render
      days_array[i].count = parseFloat(days_array[i].count.toFixed(2));
    }
    return days_array;
  }, [props.sessions]);

  return days ? (
    <ActivityCalendar
      hideMonthLabels
      eventHandlers={{
        onClick: () => {
          return (data) => props.viewDayDetails(data.date);
        },
      }}
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 16,
        marginBottom: 16,
      }}
      theme={{
        level0: Color(currentTheme?.primary_hex).alpha(0.1).string(),
        level1: Color(currentTheme?.primary_hex).alpha(0.4).string(),
        level2: Color(currentTheme?.primary_hex).alpha(0.6).string(),
        level3: Color(currentTheme?.primary_hex).alpha(0.8).string(),
        level4: currentTheme?.primary_hex!,
      }}
      color={currentTheme?.primary_hex}
      data={days.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )}
      labels={{
        legend: {
          less: "Less",
          more: "More",
        },
        months: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        tooltip: "<strong>Focused for {{count}}h</strong> on {{date}}",
        weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      }}
      hideTotalCount
    >
      <ReactTooltip html />
    </ActivityCalendar>
  ) : null;
};

export default ActivityView;
