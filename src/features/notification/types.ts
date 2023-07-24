import { IconType } from "react-icons";

export type NotificationConfig = {
  durationMs: number;
  autoclose: boolean;
};

export type Notification = {
  message: string;
  icon: IconType;
  config: NotificationConfig;
};
