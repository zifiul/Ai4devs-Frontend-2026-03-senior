import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PositionRow as PositionRowType } from '../../types/dashboard';
import { fetchPositions } from '../../services/positionService';
import StatCard from './StatCard';
import PositionsFilters from './PositionsFilters';
import PositionsTable from './PositionsTable';
import PositionsPagination from './PositionsPagination';

const PAGE_SIZE = 10;

const PositionsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [positions, setPositions] = useState<PositionRowType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchPositions();
        setPositions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const departmentOptions = useMemo(
    () => Array.from(new Set(positions.map((p) => p.department).filter((d) => d !== '—' && d !== ''))),
    [positions]
  );

  const locationOptions = useMemo(
    () => Array.from(new Set(positions.map((p) => p.location).filter((l) => l !== ''))),
    [positions]
  );

  const filteredPositions = useMemo(() => {
    let result = [...positions];
    if (search) result = result.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));
    if (department) result = result.filter((p) => p.department === department);
    if (location) result = result.filter((p) => p.location === location);
    if (statusFilter) result = result.filter((p) => p.status === statusFilter);
    result.sort((a, b) =>
      sortAsc ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
    );
    return result;
  }, [positions, search, department, location, statusFilter, sortAsc]);

  const total = filteredPositions.length;
  const paginatedPositions = filteredPositions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const hasActiveFilter = !!(search || department || location || statusFilter);
  const emptyMessage = hasActiveFilter ? 'No positions match your filters.' : 'No positions found.';

  const openCount = positions.filter((p) => p.status === 'OPEN').length;
  const pausedCount = positions.filter((p) => p.status === 'PAUSED').length;
  const totalApplicants = positions.reduce((sum, p) => sum + p.applicants, 0);

  const handleSearchChange = (v: string) => { setSearch(v); setPage(1); };
  const handleDepartmentChange = (v: string) => { setDepartment(v); setPage(1); };
  const handleLocationChange = (v: string) => { setLocation(v); setPage(1); };
  const handleStatusChange = (v: string) => { setStatusFilter(v); setPage(1); };
  const handleSort = () => setSortAsc((prev) => !prev);
  const handleViewProcess = (id: number) => navigate(`/positions/${id}`);
  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => p + 1);

  return (
    <div>
      <div className="bg-white border-b border-[#e2e2e2] px-6 pt-6 pb-[25px]">
        <div className="text-[12px] text-[#737687] mb-2">
          <span>Home</span>
          <span className="mx-1">/</span>
          <span className="text-[#1a1c1c]">Positions</span>
        </div>
        <h1 className="text-[32px] text-[#1a1c1c] font-normal font-['IBM_Plex_Sans'] leading-[32px]">
          Positions
        </h1>
      </div>
      <div className="px-6 pt-6 flex flex-col gap-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-[#004ccd] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4">
              <StatCard label="Total Positions" value={String(positions.length)} />
              <StatCard label="Open" value={String(openCount)} />
              <StatCard label="Paused" value={String(pausedCount)} />
              <StatCard label="Applicants" value={String(totalApplicants)} />
            </div>
            {error ? (
              <div className="rounded border border-red-300 bg-red-50 text-red-800 p-4">
                {error}
              </div>
            ) : (
              <div className="bg-white border border-[#e2e2e2] rounded-[2px] overflow-hidden mb-6">
                <PositionsFilters
                  search={search}
                  department={department}
                  location={location}
                  status={statusFilter}
                  departmentOptions={departmentOptions}
                  locationOptions={locationOptions}
                  sortAsc={sortAsc}
                  onSearchChange={handleSearchChange}
                  onDepartmentChange={handleDepartmentChange}
                  onLocationChange={handleLocationChange}
                  onStatusChange={handleStatusChange}
                  onSort={handleSort}
                />
                <PositionsTable
                  positions={paginatedPositions}
                  onViewProcess={handleViewProcess}
                  emptyMessage={emptyMessage}
                />
                <PositionsPagination
                  page={page}
                  pageSize={PAGE_SIZE}
                  total={total}
                  onPrev={handlePrev}
                  onNext={handleNext}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PositionsDashboard;
