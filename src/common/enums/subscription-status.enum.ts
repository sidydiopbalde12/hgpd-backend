export enum SubscriptionStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export const SubscriptionStatusLabels = {
  [SubscriptionStatus.ACTIVE]: 'Actif',
  [SubscriptionStatus.EXPIRED]: 'Expiré',
  [SubscriptionStatus.CANCELLED]: 'Annulé',
};