import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_API_URL || "https://kot-pos-backend.onrender.com";

// ── Event types ───────────────────────────────────────────────
export type NotificationEvent =
  | "order:new"
  | "kot:updated"
  | "table:updated"
  | "billing:created"
  | "room:joined"
  | "connect"
  | "disconnect";

// ── Payload types ─────────────────────────────────────────────
export interface KotPayload {
  _id: string;
  orderType: "dine-in" | "takeaway";
  tableNumber?: number;
  customerName?: string;
  status: "pending" | "preparing" | "ready" | "served" | "cancelled";
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  createdAt: string;
}

export interface TablePayload {
  _id: string;
  tableNumber: number;
  status: string;
  currentCustomer?: { name: string; phone: string };
}

export interface BillPayload {
  _id: string;
  billNumber: string;
  customerName: string;
  totalAmount: number;
  paymentStatus: string;
}

// ── Role → Room map ───────────────────────────────────────────
const ROOM_MAP: Record<string, string> = {
  chef: "kitchen",
  waiter: "waiters",
  cashier: "cashiers",
  admin: "admin",
  manager: "admin",
};

// ── Sound definitions using Web Audio API ─────────────────────
// No external files needed — generated programmatically
type SoundType = "newOrder" | "ready" | "preparing" | "cancelled" | "billing";

const playSound = (type: SoundType): void => {
  try {
    const ctx = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    )();

    const sounds: Record<SoundType, () => void> = {
      // ── New order — double ding (chef attention) ────────────
      newOrder: () => {
        [0, 200].forEach((delay) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.type = "sine";
          o.frequency.setValueAtTime(880, ctx.currentTime + delay / 1000);
          o.frequency.exponentialRampToValueAtTime(
            660,
            ctx.currentTime + delay / 1000 + 0.15,
          );
          g.gain.setValueAtTime(0.4, ctx.currentTime + delay / 1000);
          g.gain.exponentialRampToValueAtTime(
            0.001,
            ctx.currentTime + delay / 1000 + 0.3,
          );
          o.start(ctx.currentTime + delay / 1000);
          o.stop(ctx.currentTime + delay / 1000 + 0.3);
        });
      },

      // ── Order ready — rising success chime ─────────────────
      ready: () => {
        const frequencies = [523, 659, 784, 1047]; // C E G C
        frequencies.forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.type = "sine";
          o.frequency.value = freq;
          const t = ctx.currentTime + i * 0.12;
          g.gain.setValueAtTime(0.35, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
          o.start(t);
          o.stop(t + 0.4);
        });
      },

      // ── Preparing — soft single tick ───────────────────────
      preparing: () => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = "sine";
        o.frequency.value = 600;
        g.gain.setValueAtTime(0.2, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        o.start(ctx.currentTime);
        o.stop(ctx.currentTime + 0.2);
      },

      // ── Cancelled — descending alert buzz ──────────────────
      cancelled: () => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g);
        g.connect(ctx.destination);
        o.type = "sawtooth";
        o.frequency.setValueAtTime(400, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);
        g.gain.setValueAtTime(0.3, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        o.start(ctx.currentTime);
        o.stop(ctx.currentTime + 0.3);
      },

      // ── Billing — cash register ─────────────────────────────
      billing: () => {
        [0, 80, 160].forEach((delay, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.connect(g);
          g.connect(ctx.destination);
          o.type = "triangle";
          o.frequency.value = [1200, 900, 1500][i];
          const t = ctx.currentTime + delay / 1000;
          g.gain.setValueAtTime(0.25, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
          o.start(t);
          o.stop(t + 0.15);
        });
      },
    };

    sounds[type]();
  } catch {
    // Audio context blocked (page not focused) — silently ignore
  }
};

// ─────────────────────────────────────────────────────────────
// Toast helper
// Uses your existing ToastContext under the hood.
// The service itself shows toasts — pages don't need to.
// ─────────────────────────────────────────────────────────────
type ToastFn = {
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
  warning: (msg: string) => void;
};

// ─────────────────────────────────────────────────────────────
// NotificationService class — singleton
// ─────────────────────────────────────────────────────────────
class NotificationService {
  private socket: Socket | null = null;
  private role: string | null = null;
  private toast: ToastFn | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private subscribers: Map<string, Set<(payload: any) => void>> = new Map();
  private connected = false;

  // ── Register your toast instance once ──────────────────────
  // Call this in App.tsx: notificationService.setToast(toast)
  setToast(toast: ToastFn): void {
    this.toast = toast;
  }

  // ── Connect — called after login ───────────────────────────
  connect(role: string): void {
    // Already connected with same role — skip
    if (this.connected && this.role === role) return;

    // Different role (e.g. after logout/login) — reconnect
    if (this.socket) this.disconnect();

    this.role = role;

    this.socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["polling", "websocket"],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    this._attachListeners();
    console.log(`🔔 NotificationService connecting as "${role}"...`);
  }

  // ── Disconnect — called on logout ──────────────────────────
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.connected = false;
    this.role = null;
    this.subscribers.clear();
    console.log("🔕 NotificationService disconnected");
  }

  // ── Subscribe to an event ───────────────────────────────────
  // Returns an unsubscribe function — call it in useEffect cleanup
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: NotificationEvent, callback: (payload: any) => void): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.get(event)?.delete(callback);
    };
  }

  // ── Check connection status ─────────────────────────────────
  isConnected(): boolean {
    return this.connected;
  }

  // ── Internal: attach all socket listeners ──────────────────
  private _attachListeners(): void {
    if (!this.socket) return;

    // ── Connection ───────────────────────────────────────────
    this.socket.on("connect", () => {
      this.connected = true;
      const room = ROOM_MAP[this.role || ""] || this.role;
      this.socket!.emit("join:room", this.role);
      console.log(`🔌 NotificationService connected | joining room: "${room}"`);
      this._publish("connect", null);
    });

    this.socket.on("room:joined", ({ room }: { room: string }) => {
      console.log(`✅ NotificationService joined room: "${room}"`);
      this._publish("room:joined", { room });
    });

    this.socket.on("disconnect", (reason: string) => {
      this.connected = false;
      console.log(`❌ NotificationService disconnected: ${reason}`);
      this._publish("disconnect", { reason });
    });

    // ── order:new — new order from waiter/cashier ─────────────
    this.socket.on("order:new", (kot: KotPayload) => {
      playSound("newOrder");

      const label =
        kot.orderType === "dine-in"
          ? `Table ${kot.tableNumber}`
          : `Takeaway — ${kot.customerName || "Customer"}`;

      this.toast?.info(`🍽️ New order — ${label}`);
      this._publish("order:new", kot);
    });

    // ── kot:updated — chef changed status ────────────────────
    this.socket.on("kot:updated", (kot: KotPayload) => {
      const label =
        kot.orderType === "dine-in"
          ? `Table ${kot.tableNumber}`
          : kot.customerName || "Takeaway";

      if (kot.status === "preparing") {
        playSound("preparing");
        this.toast?.info(`👨‍🍳 ${label} — Being prepared`);
      }

      if (kot.status === "ready") {
        playSound("ready");
        this.toast?.success(`✅ ${label} — Ready! Serve now`);
      }

      if (kot.status === "cancelled") {
        playSound("cancelled");
        this.toast?.error(`❌ ${label} — Cancelled by kitchen`);
      }

      this._publish("kot:updated", kot);
    });

    // ── table:updated — table status changed ─────────────────
    this.socket.on("table:updated", (table: TablePayload) => {
      this._publish("table:updated", table);
    });

    // ── billing:created — new bill or payment ─────────────────
    this.socket.on("billing:created", (bill: BillPayload) => {
      playSound("billing");
      this.toast?.success(
        `💰 Bill ${bill.billNumber} — ₹${bill.totalAmount.toLocaleString()}`,
      );
      this._publish("billing:created", bill);
    });
  }

  // ── Internal: publish to all subscribers ───────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _publish(event: string, payload: any): void {
    this.subscribers.get(event)?.forEach((cb) => {
      try {
        cb(payload);
      } catch (err) {
        console.error(`NotificationService subscriber error [${event}]:`, err);
      }
    });
  }
}

// ── Singleton export ──────────────────────────────────────────
// One instance shared across entire app
export const notificationService = new NotificationService();
