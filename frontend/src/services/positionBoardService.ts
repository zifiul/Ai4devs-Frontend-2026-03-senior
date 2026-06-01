import {
  InterviewFlowResponse,
  Candidate,
  UpdateStageRequest,
  UpdateStageResponse,
} from '../types/positionBoard';

const BASE_URL = 'http://localhost:3010';

export const fetchInterviewFlow = async (id: string): Promise<InterviewFlowResponse> => {
  const response = await fetch(`${BASE_URL}/position/${id}/interviewflow`);
  if (!response.ok) throw new Error('Failed to fetch interview flow');
  return response.json() as Promise<InterviewFlowResponse>;
};

export const fetchCandidates = async (id: string): Promise<Candidate[]> => {
  const response = await fetch(`${BASE_URL}/position/${id}/candidates`);
  if (!response.ok) throw new Error('Failed to fetch candidates');
  return response.json() as Promise<Candidate[]>;
};

export const updateCandidateStage = async (
  candidateId: number,
  body: UpdateStageRequest
): Promise<UpdateStageResponse> => {
  const response = await fetch(`${BASE_URL}/candidates/${candidateId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Failed to update candidate stage');
  return response.json() as Promise<UpdateStageResponse>;
};
