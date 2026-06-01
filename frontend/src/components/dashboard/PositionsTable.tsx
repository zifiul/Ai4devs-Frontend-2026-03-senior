import React from 'react';
import { PositionsTableProps } from '../../types/dashboard';
import PositionRow from './PositionRow';

const COL_WIDTHS = [143, 106, 86, 119, 91, 192, 95, 91, 50];

const PositionsTable: React.FC<PositionsTableProps> = ({
  positions,
  onViewProcess,
  emptyMessage = 'No positions found.',
}) => (
  <div className="w-full overflow-auto">
    <table className="w-full border-separate border-spacing-0">
      <thead>
        <tr className="bg-[#f3f3f3] border-b border-[#e2e2e2]">
          {[
            'Role Title',
            'Department',
            'Location',
            'Hiring Manager',
            'Applicants',
            'Stage Distribution',
            'Status',
            'Last Updated',
            '',
          ].map((header, i) => (
            <th
              key={header || `col-${i}`}
              scope="col"
              className="text-[12px] font-medium text-[#424656] px-4 py-[15.5px] font-['IBM_Plex_Sans'] whitespace-nowrap text-left"
              style={{ width: COL_WIDTHS[i] }}
            >
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {positions.length === 0 ? (
          <tr>
            <td
              colSpan={9}
              className="px-4 py-8 text-center text-[14px] text-[#737687]"
            >
              {emptyMessage}
            </td>
          </tr>
        ) : (
          positions.map((position) => (
            <PositionRow
              key={position.id}
              position={position}
              onViewProcess={onViewProcess}
            />
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default PositionsTable;
