export enum IdentityDocType {
  CNI = 'cni',
  PASSPORT = 'passport',
  PERMIT = 'permit',
}

export const IdentityDocTypeLabels = {
  [IdentityDocType.CNI]: "Carte Nationale d'Identité",
  [IdentityDocType.PASSPORT]: 'Passeport',
  [IdentityDocType.PERMIT]: 'Permis de conduire',
};
