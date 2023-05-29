import { DocumentType } from '@okampus/shared/enums';

// TODO: setup translations and i18n
export const teamDocumentTitle = (type: DocumentType) => {
  if (type === DocumentType.AssociationConstitution) return 'Ajout des statuts associatifs';
  if (type === DocumentType.ClubCharter) return 'Ajout du règlement intérieur de votre association';
  if (type === DocumentType.TeamGraphicCharter) return 'Ajout de votre charte graphique';
  if (type === DocumentType.TenantGuide) return "Ajout d'un guide associatif";
  return "Ajout d'un document";
};

export const teamDocumentLabel = (type: DocumentType) => {
  if (type === DocumentType.AssociationConstitution) return 'Statuts associatifs';
  if (type === DocumentType.ClubCharter) return 'Règlement intérieur';
  if (type === DocumentType.TenantGuide) return 'Guide associatif';
  if (type === DocumentType.TeamGraphicCharter) return 'Charte graphique';
  return 'Document';
};
