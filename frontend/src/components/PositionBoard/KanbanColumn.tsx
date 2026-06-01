import React from 'react';
import { InterviewStep, Candidate } from '../../types/positionBoard';
import CandidateCard from './CandidateCard';

type KanbanColumnProps = {
  step: InterviewStep;
  candidates: Candidate[];
  isDragOver: boolean;
  draggedCandidateId: number | null;
  onDragOver: (e: React.DragEvent, stepName: string) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, targetStep: InterviewStep) => void;
  onCardDragStart: (
    e: React.DragEvent,
    candidateId: number,
    applicationId: number,
    sourceStepName: string
  ) => void;
};

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  step,
  candidates,
  isDragOver,
  draggedCandidateId,
  onDragOver,
  onDragLeave,
  onDrop,
  onCardDragStart,
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(e, step.name);
  };

  const handleDrop = (e: React.DragEvent) => {
    onDrop(e, step);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col min-w-[240px] w-[240px] bg-[#f3f3f3] border border-[#e2e2e2] rounded-[2px] p-3 ${
        isDragOver ? 'ring-2 ring-[#004ccd]' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[20px] font-['IBM_Plex_Sans'] font-normal text-[#1a1c1c] leading-[26px]">
          {step.name}
        </h2>
        <span className="ml-2 text-[12px] font-medium bg-[#e2e2e2] text-[#424656] rounded-full px-2 py-[1px]">
          {candidates.length}
        </span>
      </div>
      <div className="flex flex-col flex-1 min-h-[120px]">
        {candidates.length === 0 ? (
          <p className="text-[12px] text-[#737687] text-center py-4 font-['IBM_Plex_Sans']">
            No candidates
          </p>
        ) : (
          candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              isDragging={draggedCandidateId === candidate.id}
              onDragStart={onCardDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
