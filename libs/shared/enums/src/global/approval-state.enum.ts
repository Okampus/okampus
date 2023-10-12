export enum ApprovalState {
  Approved = 'Approved', // Approved by the validator (or auto-validated)
  Rejected = 'Rejected', // Rejected by the validator
  Pending = 'Pending',
  Canceled = 'Canceled', // Canceled by the user
}
