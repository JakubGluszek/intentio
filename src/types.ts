import { Session } from "./bindings/Session";

export interface DayDetail {
  date: string;
  duration: number;
  sessions?: Session[];
}

export type TimerType = "focus" | "break" | "long break";

export type ThemeFormData = {
  name: string;
  window_hex: string;
  base_hex: string;
  primary_hex: string;
  text_hex: string;
};
