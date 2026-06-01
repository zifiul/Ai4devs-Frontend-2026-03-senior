import React from 'react';
import { PositionsPaginationProps } from '../../types/dashboard';

const PositionsPagination: React.FC<PositionsPaginationProps> = ({
  page,
  pageSize,
  total,
  onPrev,
  onNext,
}) => {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const isPrevDisabled = page === 1;
  const isNextDisabled = page * pageSize >= total;

  return (
    <div className="bg-[#f9f9f9] border-t border-[#e2e2e2] px-2 py-2 flex items-center justify-between">
      <span className="text-[14px] text-[#737687] font-['IBM_Plex_Sans']">
        Showing {start}–{end} of {total} positions
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className={`p-1 rounded-[2px] ${isPrevDisabled ? 'opacity-50 pointer-events-none' : 'hover:bg-[#e2e2e2]'}`}
          onClick={onPrev}
          disabled={isPrevDisabled}
          aria-label="Previous page"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          className={`p-1 rounded-[2px] ${isNextDisabled ? 'opacity-50 pointer-events-none' : 'hover:bg-[#e2e2e2]'}`}
          onClick={onNext}
          disabled={isNextDisabled}
          aria-label="Next page"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PositionsPagination;
