import React from "react";
import ActivityCalendar, { Day } from "react-activity-calendar";
import ReactTooltip from "react-tooltip";
import Color from "color";

import { Theme } from "@/bindings/Theme";
import { Session } from "@/bindings/Session";

export interface CalendarProps {
  theme: Theme;
  days: Day[];
}

export const Calendar: React.FC<CalendarProps> = (props) => {
  return (
    <ActivityCalendar
      hideMonthLabels
      eventHandlers={{
        onClick: () => {
          return () => null;
        },
      }}
      style={{
        marginLeft: "auto",
        marginRight: "auto",
        marginTop: 8,
        marginBottom: 8,
      }}
      theme={{
        level0: Color(props.theme.primary_hex).alpha(0.1).string(),
        level1: Color(props.theme.primary_hex).alpha(0.4).string(),
        level2: Color(props.theme.primary_hex).alpha(0.6).string(),
        level3: Color(props.theme.primary_hex).alpha(0.8).string(),
        level4: props.theme.primary_hex!,
      }}
      color={props.theme.primary_hex}
      data={props.days.sort(
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
  );
};

export interface useCalendarProps {
  sessions: Session[];
}

export const useCalendar = (props: useCalendarProps) => {
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

  return { days };
};
