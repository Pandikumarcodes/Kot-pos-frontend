import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PaginationMeta } from "../../types/query";

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
  showSummary?: boolean;
  className?: string;
}

const visiblePages = (page: number, pages: number): number[] => {
  const count = Math.min(5, pages);
  const start =
    pages <= 5 ? 1 : page <= 3 ? 1 : page >= pages - 2 ? pages - 4 : page - 2;

  return Array.from({ length: count }, (_, index) => start + index);
};

export function Pagination({
  pagination,
  onPageChange,
  showSummary = false,
  className,
}: PaginationProps) {
  const { page, limit, total, pages, hasNext, hasPrev } = pagination;
  const pageNumbers = visiblePages(page, pages);
  const firstItem = total === 0 ? 0 : Math.min((page - 1) * limit + 1, total);
  const lastItem = Math.min(page * limit, total);

  return (
    <nav
      aria-label="Pagination"
      className={`flex flex-wrap items-center justify-between gap-3 bg-kot-white rounded-2xl shadow-kot px-4 py-3 ${className ?? ""}`}
    >
      <div className="text-xs sm:text-sm text-kot-text">
        {showSummary ? (
          <span>
            Showing <span className="font-semibold text-kot-darker">{firstItem}–{lastItem}</span>{" "}
            of <span className="font-semibold text-kot-darker">{total}</span>
          </span>
        ) : (
          <span>
            Page <span className="font-semibold text-kot-darker">{page}</span> of{" "}
            <span className="font-semibold text-kot-darker">{pages}</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          aria-label="Previous page"
          className="flex h-9 items-center gap-1 rounded-lg border-2 border-kot-chart px-2 text-kot-darker transition-colors hover:bg-kot-light disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          <span className="sr-only">Previous</span>
        </button>

        <div className="hidden sm:flex gap-1">
          {pageNumbers.map((pageNumber) => (
            <button
              type="button"
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              aria-label={`Page ${pageNumber}`}
              aria-current={pageNumber === page ? "page" : undefined}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                pageNumber === page
                  ? "bg-kot-dark text-white"
                  : "border-2 border-kot-chart text-kot-darker hover:bg-kot-light"
              }`}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          aria-label="Next page"
          className="flex h-9 items-center gap-1 rounded-lg border-2 border-kot-chart px-2 text-kot-darker transition-colors hover:bg-kot-light disabled:cursor-not-allowed disabled:opacity-40"
        >
          <span className="sr-only">Next</span>
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
}
