export enum ApprovalState {
  Approved = 'Approved', // Approved by the validator (or auto-validated)
  Rejected = 'Rejected', // Rejected by the validator
  Canceled = 'Canceled', // Canceled by the user
  Pending = 'Pending',
}
