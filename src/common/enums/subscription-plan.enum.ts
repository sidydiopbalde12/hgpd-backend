export enum SubscriptionPlan {
  FREE = 'free',
  PREMIUM = 'premium',
  PREMIUM_PLUS = 'premium_plus',
}

export const SubscriptionPlanLabels = {
  [SubscriptionPlan.FREE]: 'Gratuit',
  [SubscriptionPlan.PREMIUM]: 'Premium',
  [SubscriptionPlan.PREMIUM_PLUS]: 'Premium+',
};

export const SubscriptionPlanPrices = {
  [SubscriptionPlan.FREE]: 0,
  [SubscriptionPlan.PREMIUM]: 15000, // 15 000 XOF/mois
  [SubscriptionPlan.PREMIUM_PLUS]: 25000, // 25 000 XOF/mois
};

export const SubscriptionPlanFeatures = {
  [SubscriptionPlan.FREE]: {
    photos: 3,
    videos: 0,
    showPhone: false,
    priority: 'standard',
  },
  [SubscriptionPlan.PREMIUM]: {
    photos: 10,
    videos: 2,
    showPhone: true,
    priority: 'medium',
  },
  [SubscriptionPlan.PREMIUM_PLUS]: {
    photos: 20,
    videos: 5,
    showPhone: true,
    priority: 'high',
  },
};