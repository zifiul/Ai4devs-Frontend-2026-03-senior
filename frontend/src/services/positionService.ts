import { PositionRow } from '../types/dashboard';

type PositionApiResponse = {
  id: number;
  title: string;
  status: string;
  location: string;
  applicationDeadline: string | null;
  companyName: string;
  department?: string;
  hiringManager?: string;
  applicants?: number;
  lastUpdated?: string;
};

const VALID_STATUSES = new Set(['OPEN', 'PAUSED', 'CLOSED', 'DRAFT']);

export const fetchPositions = async (): Promise<PositionRow[]> => {
  const response = await fetch('http://localhost:3010/position');
  if (!response.ok) throw new Error('Failed to fetch positions');
  const data: PositionApiResponse[] = await response.json();
  return data.map((p) => ({
    id: p.id,
    title: p.title,
    department: p.department || '—',
    location: p.location,
    hiringManager: p.hiringManager || '—',
    applicants: p.applicants ?? 0,
    stageSegments: [],
    status: (VALID_STATUSES.has(p.status) ? p.status : 'OPEN') as PositionRow['status'],
    lastUpdated: p.lastUpdated ?? '',
  }));
};
