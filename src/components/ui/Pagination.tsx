import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./Button";
import { clampPage, getPageCount, getPageEnd, getPageStart } from "./sharedUtils";
import type { PaginationState } from "./sharedTypes";

export function Pagination({ state, onPageChange, className = "" }: { state: PaginationState; onPageChange: (page: number) => void; className?: string }) {
  const pageCount = getPageCount(state); const page = clampPage(state.page, pageCount);
  return <nav aria-label="Pagination" className={`flex flex-wrap items-center justify-between gap-3 text-sm text-kot-text ${className}`}><span aria-live="polite">{getPageStart(state)}–{getPageEnd(state)} of {state.total}</span><div className="flex items-center gap-1"><Button variant="secondary" size="sm" aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)}><ChevronLeft aria-hidden="true" className="h-4 w-4" /></Button><span className="px-2" aria-current="page">Page {page} of {pageCount}</span><Button variant="secondary" size="sm" aria-label="Next page" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}><ChevronRight aria-hidden="true" className="h-4 w-4" /></Button></div></nav>;
}
