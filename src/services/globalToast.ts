type ToastType = "success" | "error" | "warning" | "info";

type ToastHandler = (type: ToastType, message: string) => void;

let _handler: ToastHandler | null = null;

// Called once by ToastProvider to register itself
export function registerGlobalToastHandler(handler: ToastHandler) {
  _handler = handler;
}

// Called by apiClient (or anywhere outside React)
export const globalToast = {
  success: (msg: string) => _handler?.("success", msg),
  error: (msg: string) => _handler?.("error", msg),
  warning: (msg: string) => _handler?.("warning", msg),
  info: (msg: string) => _handler?.("info", msg),
};
