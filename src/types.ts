import { Session } from "./bindings/Session";

export type IntentsSort = "asc" | "desc";

export interface DayDetail {
  date: string;
  duration: number;
  sessions?: Session[];
}

export type SessionType = "Focus" | "Break" | "LongBreak";

export interface TimerSession {
  type: SessionType;
  duration: number;
  elapsedTime: number;
  iterations: number;
  isPlaying: boolean;
  startedAt?: string;
}
