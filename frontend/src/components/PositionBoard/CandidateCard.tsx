import React from 'react';
import { Candidate } from '../../types/positionBoard';
import ScoreDisplay from './ScoreDisplay';

type CandidateCardProps = {
  candidate: Candidate;
  isDragging: boolean;
  onDragStart: (
    e: React.DragEvent,
    candidateId: number,
    applicationId: number,
    sourceStepName: string
  ) => void;
};

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, isDragging, onDragStart }) => {
  const handleDragStart = (e: React.DragEvent) => {
    onDragStart(e, candidate.id, candidate.applicationId, candidate.currentInterviewStep);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      alert('Use a mouse or pointer device to drag candidates between stages.');
    }
  };

  return (
    <div
      draggable="true"
      role="button"
      tabIndex={0}
      aria-label={`Drag ${candidate.fullName} to another stage`}
      aria-grabbed={isDragging}
      onDragStart={handleDragStart}
      onKeyDown={handleKeyDown}
      className="bg-white border border-[#e2e2e2] rounded-[0px] p-4 mb-2 cursor-grab select-none"
    >
      <p className="text-[14px] font-['IBM_Plex_Sans'] text-[#1a1c1c] font-normal leading-[20px] mb-1">
        {candidate.fullName}
      </p>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-[12px] font-['IBM_Plex_Sans'] font-medium text-[#737687]">
          Score:
        </span>
        <ScoreDisplay score={candidate.averageScore} />
      </div>
    </div>
  );
};

export default CandidateCard;
