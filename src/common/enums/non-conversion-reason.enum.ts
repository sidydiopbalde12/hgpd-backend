export enum NonConversionReason {
  INADEQUATE_BUDGET = 'inadequate_budget',
  UNSUITABLE_SERVICE = 'unsuitable_service',
  EVENT_POSTPONED = 'event_postponed',
  LOCATION_OUT_OF_AREA = 'location_out_of_area',
  UNAVAILABLE_ON_DATE = 'unavailable_on_date',
  CLIENT_NOT_RESPONSIVE = 'client_not_responsive',
  CLIENT_CHOSE_ANOTHER = 'client_chose_another',
  OTHER = 'other',
}

export const NonConversionReasonLabels = {
  [NonConversionReason.INADEQUATE_BUDGET]: 'Budget inadapté',
  [NonConversionReason.UNSUITABLE_SERVICE]: 'Prestation non adaptée',
  [NonConversionReason.EVENT_POSTPONED]: 'Événement reporté',
  [NonConversionReason.LOCATION_OUT_OF_AREA]: 'Localisation hors périmètre',
  [NonConversionReason.UNAVAILABLE_ON_DATE]: 'Indisponibilité à la date',
  [NonConversionReason.CLIENT_NOT_RESPONSIVE]: 'Client non réactif',
  [NonConversionReason.CLIENT_CHOSE_ANOTHER]: 'Client a choisi un autre prestataire',
  [NonConversionReason.OTHER]: 'Autre',
};