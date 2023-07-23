import React from "react";

import { Notification } from "./types";

export interface NotificationProps extends Notification { }

export const NotificationView: React.FC<NotificationProps> = (props) => {
  return <div>{props.message}</div>;
};
