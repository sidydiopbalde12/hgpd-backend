export enum SponsorshipStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  PAUSED = 'paused',
}

export const SponsorshipStatusLabels = {
  [SponsorshipStatus.ACTIVE]: 'Actif',
  [SponsorshipStatus.EXPIRED]: 'Expiré',
  [SponsorshipStatus.PAUSED]: 'En pause',
};
