export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
}

export const NotificationStatusLabels = {
  [NotificationStatus.PENDING]: 'En attente',
  [NotificationStatus.SENT]: 'Envoyé',
  [NotificationStatus.DELIVERED]: 'Délivré',
  [NotificationStatus.FAILED]: 'Échoué',
};
