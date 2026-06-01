import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InterviewStep, Candidate, ToastState } from '../../types/positionBoard';
import {
  fetchInterviewFlow,
  fetchCandidates,
  updateCandidateStage,
} from '../../services/positionBoardService';
import KanbanColumn from './KanbanColumn';
import Toast from './Toast';

const PositionBoard: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [positionName, setPositionName] = useState<string>('');
  const [steps, setSteps] = useState<InterviewStep[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dragOverStepName, setDragOverStepName] = useState<string | null>(null);
  const [draggedCandidateId, setDraggedCandidateId] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [draggedApplicationId, setDraggedApplicationId] = useState<number | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dragSourceStepName, setDragSourceStepName] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!id || isNaN(parseInt(id, 10))) {
      setError('Invalid position ID.');
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const [flowData, candidatesData] = await Promise.all([
          fetchInterviewFlow(id),
          fetchCandidates(id),
        ]);
        setPositionName(flowData.interviewFlow.positionName);
        setSteps(
          [...flowData.interviewFlow.interviewFlow.interviewSteps].sort(
            (a, b) => a.orderIndex - b.orderIndex
          )
        );
        setCandidates(candidatesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load position data');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const startToastTimer = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 3000);
  };

  const handleBack = () => navigate('/positions');

  const handleCardDragStart = (
    e: React.DragEvent,
    candidateId: number,
    applicationId: number,
    sourceStepName: string
  ) => {
    e.dataTransfer.setData('candidateId', String(candidateId));
    e.dataTransfer.setData('applicationId', String(applicationId));
    e.dataTransfer.setData('sourceStepName', sourceStepName);
    setDraggedCandidateId(candidateId);
    setDraggedApplicationId(applicationId);
    setDragSourceStepName(sourceStepName);
  };

  const handleDragOver = (e: React.DragEvent, stepName: string) => {
    e.preventDefault();
    setDragOverStepName(stepName);
  };

  const handleDragLeave = () => {
    setDragOverStepName(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStep: InterviewStep) => {
    setDragOverStepName(null);

    const candidateIdStr = e.dataTransfer.getData('candidateId');
    const applicationIdStr = e.dataTransfer.getData('applicationId');
    const sourceStepName = e.dataTransfer.getData('sourceStepName');

    const candidateId = parseInt(candidateIdStr, 10);
    const applicationId = parseInt(applicationIdStr, 10);

    if (sourceStepName === targetStep.name) return;
    if (isNaN(candidateId)) return;

    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidateId ? { ...c, currentInterviewStep: targetStep.name } : c
      )
    );

    try {
      const result = await updateCandidateStage(candidateId, {
        applicationId: String(applicationId),
        currentInterviewStep: String(targetStep.id),
      });
      setToast({
        message: result.message || 'Candidate stage updated successfully',
        variant: 'success',
      });
      startToastTimer();
    } catch {
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidateId ? { ...c, currentInterviewStep: sourceStepName } : c
        )
      );
      setToast({ message: 'Failed to update candidate stage', variant: 'error' });
      startToastTimer();
    } finally {
      setDraggedCandidateId(null);
      setDraggedApplicationId(null);
      setDragSourceStepName(null);
    }
  };

  const handleDismissToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(null);
  };

  const displayName = positionName || 'Position Board';

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <div className="bg-white border-b border-[#e2e2e2] px-6 pt-6 pb-[25px]">
        <div className="text-[12px] text-[#737687] mb-2">
          Home / Positions / {displayName}
        </div>
        <button
          onClick={handleBack}
          className="text-[#004ccd] text-[14px] font-['IBM_Plex_Sans'] px-0 py-2 hover:underline cursor-pointer flex items-center gap-1 mb-2 bg-transparent border-none"
        >
          ← Back to Positions
        </button>
        <h1 className="text-[32px] text-[#1a1c1c] font-normal font-['IBM_Plex_Sans'] leading-[32px]">
          {displayName}
        </h1>
      </div>

      <div className="px-6 pt-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div
              role="status"
              aria-label="Loading position board"
              className="w-8 h-8 border-4 border-[#004ccd] border-t-transparent rounded-full animate-spin"
            />
          </div>
        ) : error ? (
          <div
            role="alert"
            className="bg-[#ffdad6] border-l-4 border-[#ba1a1a] pl-5 pr-4 py-4 text-[#93000a] rounded-[2px]"
          >
            {error}
          </div>
        ) : steps.length === 0 ? (
          <p className="text-[14px] text-[#737687] font-['IBM_Plex_Sans']">
            No interview steps configured for this position.
          </p>
        ) : (
          <div className="flex flex-row gap-4 overflow-x-auto pb-6">
            {steps.map((step) => (
              <KanbanColumn
                key={step.id}
                step={step}
                candidates={candidates.filter((c) => c.currentInterviewStep === step.name)}
                isDragOver={dragOverStepName === step.name}
                draggedCandidateId={draggedCandidateId}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onCardDragStart={handleCardDragStart}
              />
            ))}
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          variant={toast.variant}
          onDismiss={handleDismissToast}
        />
      )}
    </div>
  );
};

export default PositionBoard;
