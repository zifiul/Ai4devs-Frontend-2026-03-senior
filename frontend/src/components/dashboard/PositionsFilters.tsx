import React from 'react';
import { PositionsFiltersProps } from '../../types/dashboard';

const PositionsFilters: React.FC<PositionsFiltersProps> = ({
  search,
  department,
  location,
  status,
  departmentOptions,
  locationOptions,
  sortAsc,
  onSearchChange,
  onDepartmentChange,
  onLocationChange,
  onStatusChange,
  onSort,
}) => (
  <div className="bg-[#f9f9f9] border-b border-[#e2e2e2] px-2 py-2 flex gap-2 items-center">
    <div className="bg-white border border-[#e2e2e2] rounded-[2px] w-64 h-[34px] flex items-center px-2 gap-2">
      <svg className="w-4 h-4 text-[#6b7280] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <input
        type="text"
        className="flex-1 text-[14px] text-[#6b7280] outline-none bg-transparent"
        placeholder="Search positions..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Filter positions"
      />
    </div>
    <select
      className="bg-white border border-[#e2e2e2] rounded-[2px] h-[32px] px-2 text-[14px] text-[#1a1c1c]"
      value={department}
      onChange={(e) => onDepartmentChange(e.target.value)}
      aria-label="Filter by department"
    >
      <option value="">All Departments</option>
      {departmentOptions.map((d) => (
        <option key={d} value={d}>{d}</option>
      ))}
    </select>
    <select
      className="bg-white border border-[#e2e2e2] rounded-[2px] h-[32px] px-2 text-[14px] text-[#1a1c1c]"
      value={location}
      onChange={(e) => onLocationChange(e.target.value)}
      aria-label="Filter by location"
    >
      <option value="">All Locations</option>
      {locationOptions.map((l) => (
        <option key={l} value={l}>{l}</option>
      ))}
    </select>
    <select
      className="bg-white border border-[#e2e2e2] rounded-[2px] h-[32px] px-2 text-[14px] text-[#1a1c1c]"
      value={status}
      onChange={(e) => onStatusChange(e.target.value)}
      aria-label="Filter by status"
    >
      <option value="">All Statuses</option>
      <option value="OPEN">Open</option>
      <option value="PAUSED">Paused</option>
      <option value="CLOSED">Closed</option>
      <option value="DRAFT">Draft</option>
    </select>
    <button
      type="button"
      className="text-[#004ccd] text-[14px] flex items-center gap-1 px-2 py-1"
      onClick={onSort}
      aria-label="Sort positions"
      aria-pressed={!sortAsc}
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
      Sort
    </button>
  </div>
);

export default PositionsFilters;
