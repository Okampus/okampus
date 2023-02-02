import { OrgDocumentType } from '@okampus/shared/enums';

export const orgDocumentTitle = (type: OrgDocumentType) => {
  if (type === OrgDocumentType.AssociationConstitution) return 'Ajout des statuts associatifs';
  if (type === OrgDocumentType.ClubCharter) return 'Ajout du règlement intérieur de votre association';
  if (type === OrgDocumentType.OrgGraphicCharter) return 'Ajout de votre charte graphique';
  if (type === OrgDocumentType.TenantGuide) return "Ajout d'un guide associatif";
  return "Ajout d'un document";
};

export const orgDocumentLabel = (type: OrgDocumentType) => {
  if (type === OrgDocumentType.AssociationConstitution) return 'Statuts associatifs';
  if (type === OrgDocumentType.ClubCharter) return 'Règlement intérieur';
  if (type === OrgDocumentType.TenantGuide) return 'Guide associatif';
  if (type === OrgDocumentType.OrgGraphicCharter) return 'Charte graphique';
  return 'Document';
};
