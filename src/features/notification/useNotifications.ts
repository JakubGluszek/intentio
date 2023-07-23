import React from "react";

import { useEvents } from "@/hooks";

import { Notification } from "./types";

export const useNotifications = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  useEvents({
    session_created: () => {
      setNotifications((prev) => [
        ...prev,
        { message: "Focus session completed" },
      ]);
    },
  });

  return { data: notifications } as const;
};
