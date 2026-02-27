export interface ConflictDeclaration {
    userName?: string;
    createdOn?: string;
  descriptionText: string;
  recurrence: number;
  notificationMessage: string;
  period: number;
  month: number;
  changedBy?: string;
  changedAt?: string;
}
