import { SessionType } from "./bindings/SessionType";

export interface TimerSession {
  type: SessionType;
  duration: number;
  elapsedTime: number;
  iterations: number;
  isPlaying: boolean;
  startedAt?: Date;
}

export type ThemeState = "Idle" | "Focus" | "Break" | "Long Break";

export type ModelId = number;
