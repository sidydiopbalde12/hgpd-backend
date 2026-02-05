export enum EventDuration {
  HALF_DAY = 'half_day',
  FULL_DAY = 'full_day',
  EVENING = 'evening',
  MULTIPLE_DAYS = 'multiple_days',
}

export const EventDurationLabels = {
  [EventDuration.HALF_DAY]: 'Demi-journée',
  [EventDuration.FULL_DAY]: 'Journée complète',
  [EventDuration.EVENING]: 'Soirée',
  [EventDuration.MULTIPLE_DAYS]: 'Plusieurs jours',
};
