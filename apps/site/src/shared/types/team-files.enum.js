export const CONSTITUTION = 'Constitution'
export const RULES = 'Rules'
export const TRANSCRIPT = 'Transcript'
export const LEGAL_RECEIPT = 'LegalReceipt'
export const BROCHURE = 'Brochure'
export const GRAPHIC_CHARTER = 'GraphicCharter'

export const TEAM_FILES = {
    [CONSTITUTION]: {
        name: {
            fr: "Statuts d'association",
            en: 'Constitution',
        },
        description: {
            fr: 'Derniers statuts officiels de votre association déposés en préfécture',
            en: 'Last official constitution of your association submitted legally',
        },
    },
    [RULES]: {
        name: {
            fr: 'Règlement intérieur (RI)',
            en: 'Rules',
        },
        description: {
            fr: 'Règlement intérieur actuellement appliqué au sein de votre association',
            en: 'Current rules of your association',
        },
    },
    [TRANSCRIPT]: {
        name: {
            fr: 'Procès-verbal (PV)',
            en: 'Transcript of the last general meeting',
        },
        description: {
            fr: "Procès-verbal de la dernière assemblée générale de l'association",
            en: 'Transcript of the last general meeting of the association',
        },
    },
    [LEGAL_RECEIPT]: {
        name: {
            fr: 'Récipissé de préfécture',
            en: 'Legal receipt',
        },
        description: {
            fr: 'Récipissé de votre dernier procès-verbal soumis au greffe des associations',
            en: 'Legal receipt of your last submitted transcript',
        },
    },
    [BROCHURE]: {
        name: {
            fr: 'Plaquette',
            en: 'Brochure',
        },
        description: {
            fr: 'Brochure partenariats de votre association',
            en: 'Partnership brochure of your association',
        },
    },
    [GRAPHIC_CHARTER]: {
        name: {
            fr: 'Charte graphique',
            en: 'Graphic charter',
        },
        description: {
            fr: 'Polices, couleurs & éléments graphiques de votre association',
            en: 'Fonts, colors & graphics of your association',
        },
    },
}
