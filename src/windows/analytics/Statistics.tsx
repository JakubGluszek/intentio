import React from "react";
import { AiFillFire } from "react-icons/ai";
import { IoMdTime } from "react-icons/io";
import { MdToday } from "react-icons/md";

import utils from "@/utils";
import { Intent } from "@/bindings/Intent";
import { Session } from "@/bindings/Session";
import { IconType } from "react-icons";

export interface StatisticsProps {
  intents: Intent[];
  sessions: Session[];
}

export const Statistics: React.FC<StatisticsProps> = (props) => {
  const today = new Date();

  const totalFocused = React.useMemo(
    () => props.sessions.reduce((p, c) => p + c.duration, 0) / 60,
    [props.sessions]
  );

  const focusedToday = React.useMemo(
    () =>
      props.sessions
        .filter((s) => s.finished_at.toDateString() == today.toDateString())
        .reduce((p, c) => p + c.duration, 0) / 60,
    [props.sessions]
  );

  const dayStreak = React.useMemo(() => {
    let dayStreak = 1;

    const sorted = props.sessions.sort(
      (a, b) => b.finished_at.getTime() - a.finished_at.getTime()
    );
    let prevDay = new Date();
    // there might be timezone related issues
    for (let i = 0; i < sorted.length; i++) {
      const s = sorted[i];
      const date = s.finished_at;

      if (date.toDateString() === prevDay.toDateString()) continue;
      date.setDate(date.getDate() + 1);

      if (date.toDateString() === prevDay.toDateString()) {
        dayStreak += 1;
        prevDay = s.finished_at;
      } else {
        break;
      }
    }

    return dayStreak;
  }, [props.sessions]);

  return (
    <div className="grow flex flex-col justify-evenly">
      <div className="w-full flex flex-row gap-2">
        <StatBox
          icon={MdToday}
          label="Today"
          content={utils.formatTime(focusedToday * 60)}
        />
        <StatBox
          icon={IoMdTime}
          label="Total"
          content={utils.formatTime(totalFocused * 60)}
        />
        <StatBox
          icon={AiFillFire}
          label="Streak"
          content={`${dayStreak} ${dayStreak === 1 ? "day" : "days"}`}
        />
      </div>
    </div>
  );
};

interface StatBoxProps {
  icon: IconType;
  label: string;
  content: string;
}

const StatBox: React.FC<StatBoxProps> = (props) => {
  return (
    <div className="w-full flex flex-col items-center gap-2">
      <div className="w-full flex flex-row items-center justify-center gap-1">
        <props.icon className="text-primary/80" size={28} />
        <span className="text-lg font-bold">{props.label}</span>
      </div>
      <div className="bg-window/60 bg-gradient-to-br from-primary/20 to-window/20 border-b-2 border-primary/80 w-full flex flex-col items-center justify-center rounded-sm px-1 py-2 shadow-lg shadow-black/30">
        <span className="font-semibold">{props.content}</span>
      </div>
    </div>
  );
};
