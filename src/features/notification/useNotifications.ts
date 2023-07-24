import React from "react";
import { MdNotifications } from "react-icons/md";

import { useEvents } from "@/hooks";

import { Notification } from "./types";

const BASE_NOTIFICATION = {
  icon: MdNotifications,
  config: {
    autoclose: true,
    durationMs: 3000,
  },
};

export const useNotifications = () => {
  const [notification, setNotification] = React.useState<Notification | null>(
    null
  );
  const [queue, setQueue] = React.useState<Notification[]>([]);

  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const queueRef = React.useRef<Notification[]>(queue);
  queueRef.current = queue;

  const displayNotification = (data: Notification) => {
    setNotification(data);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setNotification(null);
      if (queueRef.current.length > 0) {
        let queueClone = [...queueRef.current];
        const next = queueClone.shift();
        if (next) {
          displayNotification(next);
          setQueue(queueClone);
        }
      }
    }, data.config.durationMs);
  };

  const handleNotification = (data: Notification) => {
    if (!notification) {
      displayNotification(data);
      return;
    }
    setQueue((prev) => [...prev, data]);
  };

  const closeNotification = () => {
    setNotification(null);
    clearTimeout(timeoutRef.current);
  };

  useEvents({
    focus_session_completed: () => {
      handleNotification({
        message: "Your Focus session has completed.",
        ...BASE_NOTIFICATION,
      });
    },
    break_completed: () => {
      handleNotification({
        message: "Your break has completed.",
        ...BASE_NOTIFICATION,
      });
    },
    long_break_completed: () => {
      handleNotification({
        message: "Your long break has completed.",
        ...BASE_NOTIFICATION,
      });
    },
  });

  return { notification, closeNotification } as const;
};
