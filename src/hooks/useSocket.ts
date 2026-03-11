import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "../Store/hooks";

const SOCKET_URL =
  import.meta.env.VITE_API_URL || "https://kot-pos-backend.onrender.com";

export const useSocket = () => {
  const { user } = useAppSelector((state) => state.auth);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user?.role) return;

    // ── Connect ───────────────────────────────────────────────
    const socket = io(SOCKET_URL, {
      withCredentials: true, // send cookies so backend can identify user
      transports: ["polling"], // skip polling, go straight to WS
      reconnectionAttempts: 5, // retry 5 times if connection drops
      reconnectionDelay: 2000, // wait 2s between retries
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log(`🔌 Socket connected: ${socket.id}`);
      // Join the room matching this user's role
      socket.emit("join:room", user.role);
    });

    socket.on("room:joined", ({ room }: { room: string }) => {
      console.log(`✅ Joined room: "${room}"`);
    });

    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log(`❌ Socket disconnected: ${reason}`);
    });

    // ── Cleanup on unmount ────────────────────────────────────
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user?.role]);

  return socketRef;
};
