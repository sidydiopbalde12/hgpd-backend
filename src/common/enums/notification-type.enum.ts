export enum NotificationType {
  NEW_DEMAND = 'new_demand',
  PAYMENT_CONFIRMATION = 'payment_confirmation',
  CONTACT_UNLOCKED = 'contact_unlocked',
  SUBSCRIPTION_EXPIRING = 'subscription_expiring',
  DEMAND_STATUS_CHANGED = 'demand_status_changed',
  NEW_REVIEW = 'new_review',
}

export const NotificationTypeLabels = {
  [NotificationType.NEW_DEMAND]: 'Nouvelle demande',
  [NotificationType.PAYMENT_CONFIRMATION]: 'Confirmation de paiement',
  [NotificationType.CONTACT_UNLOCKED]: 'Contact débloqué',
  [NotificationType.SUBSCRIPTION_EXPIRING]: 'Abonnement expire bientôt',
  [NotificationType.DEMAND_STATUS_CHANGED]: 'Statut de demande changé',
  [NotificationType.NEW_REVIEW]: 'Nouvel avis reçu',
};