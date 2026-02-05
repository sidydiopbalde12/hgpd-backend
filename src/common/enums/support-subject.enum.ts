export enum SupportSubject {
  PAYMENT_ISSUE = 'payment_issue',
  REPORT_CLIENT = 'report_client',
  MODIFY_INFORMATION = 'modify_information',
  OTHER = 'other',
}

export const SupportSubjectLabels = {
  [SupportSubject.PAYMENT_ISSUE]: 'Problème de paiement',
  [SupportSubject.REPORT_CLIENT]: 'Signaler un client',
  [SupportSubject.MODIFY_INFORMATION]: 'Information à modifier',
  [SupportSubject.OTHER]: 'Autre',
};
