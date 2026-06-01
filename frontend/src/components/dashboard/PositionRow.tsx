import React from 'react';
import { PositionRowProps } from '../../types/dashboard';
import StatusBadge from './StatusBadge';
import StageDistributionBar from './StageDistributionBar';

const PositionRow: React.FC<PositionRowProps> = ({ position, onViewProcess }) => (
  <tr className="border-b border-[#e2e2e2] text-[14px] text-[#1a1c1c] group">
    <td className="px-4 py-[18.5px]">
      <button
        type="button"
        className="text-[#004ccd] font-medium cursor-pointer bg-transparent border-0 p-0 text-left text-[14px]"
        onClick={() => onViewProcess(position.id)}
      >
        {position.title}
      </button>
    </td>
    <td className="px-4 py-[8.5px]">{position.department}</td>
    <td className="px-4 py-[18.5px]">{position.location}</td>
    <td className="px-4 py-[18.5px]">{position.hiringManager}</td>
    <td className="px-4 py-[18.5px] text-right font-['IBM_Plex_Mono']">
      {position.applicants}
    </td>
    <td className="px-4 py-[18.5px]">
      <StageDistributionBar segments={position.stageSegments} />
    </td>
    <td className="px-4 py-[18.5px]">
      <StatusBadge status={position.status} />
    </td>
    <td className="px-4 py-[18.5px] text-[#737687]">{position.lastUpdated}</td>
    <td className="px-4 py-[18.5px]">
      <button
        type="button"
        className="opacity-0 group-hover:opacity-100 text-[#737687] bg-transparent border-0 p-1 cursor-pointer"
        aria-label={`More options for ${position.title}`}
      >
        ⋮
      </button>
    </td>
  </tr>
);

export default PositionRow;
