import React from 'react';
import { StatusBadgeProps } from '../../types/dashboard';

const badgeStyles: Record<StatusBadgeProps['status'], string> = {
  OPEN: 'bg-[#dbe1ff] text-[#003da9]',
  PAUSED: 'bg-[#e2e2e2] text-[#424656]',
  CLOSED: 'bg-[#e2e2e2] text-[#424656]',
  DRAFT: 'bg-[#f3f3f3] text-[#737687]',
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span
    className={`${badgeStyles[status]} px-2 py-0.5 rounded-[2px] text-[12px] font-medium uppercase tracking-[0.3px] font-['IBM_Plex_Sans']`}
    aria-label={status}
  >
    {status}
  </span>
);

export default StatusBadge;
