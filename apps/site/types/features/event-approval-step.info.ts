export type EventApprovalStepMinimalInfo = {
  id: string;
  name: string;
  order: string;
  description: string;
};

export type EventApprovalStepDetailsInfo = EventApprovalStepMinimalInfo & {
  nextSteps: EventApprovalStepMinimalInfo[];
  previousStep: EventApprovalStepMinimalInfo[];
};
