import { Button } from "./Button";
import { Modal } from "./Modal";
export function ConfirmDialog({ open, title = "Confirm action", message, confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm, onCancel, destructive = false }: { open: boolean; title?: string; message: string; confirmLabel?: string; cancelLabel?: string; onConfirm: () => void; onCancel: () => void; destructive?: boolean }) {
  return <Modal open={open} title={title} onClose={onCancel}><p className="text-sm text-kot-text">{message}</p><div className="flex justify-end gap-2"><Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button><Button variant={destructive ? "danger" : "primary"} onClick={onConfirm}>{confirmLabel}</Button></div></Modal>;
}
