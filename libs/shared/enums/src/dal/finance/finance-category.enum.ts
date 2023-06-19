export enum FinanceCategory {
  Entertainment = 'Entertainment',
  Equipement = 'Equipement',
  Errands = 'Errands',
  MemberReimbursement = 'MemberReimbursement',
  MembershipFees = 'MembershipFees',
  Subvention = 'Subvention',
  Marketing = 'Marketing',
  Subscriptions = 'Subscriptions',
  Transportation = 'Transportation',
  Other = 'Other',
  Unknown = 'Unknown',
}

console.log(Object.keys(FinanceCategory).join(', '));
