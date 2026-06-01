export type StageSegment = {
  color: string;
  widthPx: number;
};

export type PositionRow = {
  id: number;
  title: string;
  department: string;
  location: string;
  hiringManager: string;
  applicants: number;
  stageSegments: StageSegment[];
  status: 'OPEN' | 'PAUSED' | 'CLOSED' | 'DRAFT';
  lastUpdated: string;
};

export type StatCardProps = {
  label: string;
  value: string;
};

export type StatusBadgeProps = {
  status: PositionRow['status'];
};

export type StageDistributionBarProps = {
  segments: StageSegment[];
};

export type PositionRowProps = {
  position: PositionRow;
  onViewProcess: (id: number) => void;
};

export type PositionsTableProps = {
  positions: PositionRow[];
  onViewProcess: (id: number) => void;
  emptyMessage?: string;
};

export type PositionsFiltersProps = {
  search: string;
  department: string;
  location: string;
  status: string;
  departmentOptions: string[];
  locationOptions: string[];
  sortAsc: boolean;
  onSearchChange: (v: string) => void;
  onDepartmentChange: (v: string) => void;
  onLocationChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onSort: () => void;
};

export type PositionsPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
};
