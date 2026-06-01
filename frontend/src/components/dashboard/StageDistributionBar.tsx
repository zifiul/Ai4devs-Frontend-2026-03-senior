import React from 'react';
import { StageDistributionBarProps } from '../../types/dashboard';

const StageDistributionBar: React.FC<StageDistributionBarProps> = ({ segments }) => (
  <div className="h-[8px] w-[160px] bg-[#e8e8e8] rounded-[2px] overflow-hidden flex">
    {segments.map((segment, i) => (
      <div
        key={i}
        className={segment.color}
        style={{ width: `${segment.widthPx}px` }}
      />
    ))}
  </div>
);

export default StageDistributionBar;
