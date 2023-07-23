import { IconType } from "react-icons";

export type Notification = {
  message: string;
  icon?: IconType;
  config?: {
    durationMs?: number;
    autoclose?: boolean;
  };
};
