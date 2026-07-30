import { useEffect, useRef, useState } from "react";
import {
  notificationService,
  type NotificationEvent,
} from "../services/notificationService";

type EventHandlers = Partial<
  Record<NotificationEvent, (payload: unknown) => void>
>;

const NOTIFICATION_EVENTS: NotificationEvent[] = [
  "order:new",
  "kot:updated",
  "table:updated",
  "billing:created",
  "room:joined",
  "connect",
  "disconnect",
];

export const useNotifications = (handlers: EventHandlers = {}): boolean => {
  const handlersRef = useRef(handlers);
  const [isConnected, setIsConnected] = useState(
    notificationService.isConnected(),
  );

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  useEffect(() => {
    const unsubs = NOTIFICATION_EVENTS.map((event) =>
      notificationService.on(event, (payload) => {
        if (event === "connect") setIsConnected(true);
        if (event === "disconnect") setIsConnected(false);
        handlersRef.current[event]?.(payload);
      }),
    );

    return () => unsubs.forEach((unsub) => unsub());
  }, []);

  return isConnected;
};
