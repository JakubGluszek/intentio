import { Queue } from "./Queue";

export interface ActiveQueue {
  data: Queue;
  sessionIdx: number;
  cycle: number;
}
