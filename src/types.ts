import { Session } from "./bindings/Session";
import { SessionType } from "./bindings/SessionType";

export type IntentsSort = "asc" | "desc";

export interface DayDetail {
  date: string;
  duration: number;
  sessions?: Session[];
}

export interface TimerSession {
  type: SessionType;
  duration: number;
  elapsedTime: number;
  iterations: number;
  isPlaying: boolean;
  startedAt?: string;
}
