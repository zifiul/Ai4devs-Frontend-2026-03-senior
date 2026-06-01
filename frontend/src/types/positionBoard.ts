export type InterviewStep = {
  id: number;
  interviewFlowId: number;
  interviewTypeId: number;
  name: string;
  orderIndex: number;
};

export type InterviewFlowResponse = {
  interviewFlow: {
    positionName: string;
    interviewFlow: {
      id: number;
      description: string;
      interviewSteps: InterviewStep[];
    };
  };
};

export type Candidate = {
  id: number;
  applicationId: number;
  fullName: string;
  currentInterviewStep: string;
  averageScore: number;
};

export type UpdateStageRequest = {
  applicationId: string;
  currentInterviewStep: string;
};

export type UpdateStageResponse = {
  message: string;
  data: {
    id: number;
    positionId: number;
    candidateId: number;
    applicationDate: string;
    currentInterviewStep: number;
    notes: null;
    interviews: unknown[];
  };
};

export type ToastState = {
  message: string;
  variant: 'success' | 'error';
};
