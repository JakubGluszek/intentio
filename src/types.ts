import { Session } from "./bindings/Session";

export type IntentsSort = "asc" | "desc";

export interface DayDetail {
  date: string;
  duration: number;
  sessions?: Session[];
}

export type TimerType = "focus" | "break" | "long break";
