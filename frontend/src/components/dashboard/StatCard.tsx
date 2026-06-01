import React from 'react';
import { StatCardProps } from '../../types/dashboard';

const StatCard: React.FC<StatCardProps> = ({ label, value }) => (
  <article
    className="bg-white border border-[#e2e2e2] rounded-[2px] p-[17px] flex flex-col gap-1"
    aria-label={label}
  >
    <span className="text-[12px] font-medium text-[#737687] uppercase tracking-[0.6px] font-['IBM_Plex_Sans']">
      {label}
    </span>
    <span className="text-[32px] text-[#1a1c1c] leading-[40px] font-normal font-['IBM_Plex_Sans']">
      {value}
    </span>
  </article>
);

export default StatCard;
