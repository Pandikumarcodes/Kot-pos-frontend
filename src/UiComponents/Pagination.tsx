import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "../hooks/usePagination";

interface PaginationProps {
  meta: PaginationMeta | null;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  meta,
  onPageChange,
  className = "",
}: PaginationProps) {
  if (!meta || meta.totalPages <= 1) return null;

  const { currentPage, totalPages, total, limit, hasNextPage, hasPrevPage } =
    meta;

  // Build page number array with ellipsis
  const getPages = (): (number | "...")[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    if (currentPage > 3) pages.push("...");
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };

  const from = (currentPage - 1) * limit + 1;
  const to = Math.min(currentPage * limit, total);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 ${className}`}
    >
      {/* Showing X–Y of Z */}
      <p className="text-xs text-kot-text order-2 sm:order-1">
        Showing{" "}
        <span className="font-semibold text-kot-darker">
          {from}–{to}
        </span>{" "}
        of <span className="font-semibold text-kot-darker">{total}</span>
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1 order-1 sm:order-2">
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!hasPrevPage}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-kot-chart text-kot-darker hover:bg-kot-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={13} />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Page numbers */}
        {getPages().map((p, i) =>
          p === "..." ? (
            <span
              key={`ellipsis-${i}`}
              className="px-1.5 text-xs text-kot-text"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={`min-w-[30px] h-[30px] rounded-lg text-xs font-medium transition-colors ${
                p === currentPage
                  ? "bg-kot-dark text-white"
                  : "border border-kot-chart text-kot-darker hover:bg-kot-light"
              }`}
            >
              {p}
            </button>
          ),
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!hasNextPage}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-kot-chart text-kot-darker hover:bg-kot-light disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
