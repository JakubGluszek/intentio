import { Session } from "./bindings/Session";

export interface DayDetail {
  date: string;
  duration: number;
  sessions?: Session[];
}
