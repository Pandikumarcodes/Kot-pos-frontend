import { useEffect, useState } from "react";
import {
  notificationService,
  type NotificationEvent,
} from "../services/notificationServices";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventHandlers = Partial<Record<NotificationEvent, (payload: any) => void>>;

export const useNotifications = (handlers: EventHandlers = {}): boolean => {
  const [isConnected, setIsConnected] = useState(
    notificationService.isConnected(),
  );

  useEffect(() => {
    const unsubs: (() => void)[] = [];

    // ── Track connection state for UI indicators ──────────────
    unsubs.push(notificationService.on("connect", () => setIsConnected(true)));
    unsubs.push(
      notificationService.on("disconnect", () => setIsConnected(false)),
    );

    // ── Register all caller-provided handlers ─────────────────
    Object.entries(handlers).forEach(([event, handler]) => {
      if (handler) {
        unsubs.push(
          notificationService.on(event as NotificationEvent, handler),
        );
      }
    });

    // ── Cleanup all on unmount ────────────────────────────────
    return () => unsubs.forEach((unsub) => unsub());

    // handlers is an object literal — exhaustive deps would cause
    // infinite re-renders, so we disable the rule here intentionally
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Returns live connection status — use for Wifi indicator in UI
  return isConnected;
};
