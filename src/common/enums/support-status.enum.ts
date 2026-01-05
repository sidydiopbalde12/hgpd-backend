export enum SupportStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export const SupportStatusLabels = {
  [SupportStatus.PENDING]: 'En attente',
  [SupportStatus.IN_PROGRESS]: 'En cours de traitement',
  [SupportStatus.RESOLVED]: 'Résolu',
  [SupportStatus.CLOSED]: 'Fermé',
};