import { Session } from "./bindings/Session";

export interface DayDetail {
  date: string;
  duration: number;
  sessions?: Session[];
}

export type TimerType = "focus" | "break" | "long break";
