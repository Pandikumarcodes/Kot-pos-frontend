import type { ReactNode } from "react";
import { Modal } from "./Modal";
export function StandardModal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: ReactNode }) { return <Modal open={open} title={title} onClose={onClose}>{children}</Modal>; }
