import * as z from 'zod';

export type GeocodeAddress = {
  latitude: number | null;
  longitude: number | null;
  category: string;
  name: string;
  streetNumber: string;
  street: string;
  zip: string;
  city: string;
  state: string;
  country: string;
  geoapifyId: string | null;
};

export const geocodeAddressSchema = z.object({
  latitude: z.number().min(-90).max(90).nullable(),
  longitude: z.number().min(-180).max(180).nullable(),
  category: z.string({ required_error: "Catégorie d'adresse requise." }),
  name: z.string(),
  streetNumber: z.string({ required_error: 'Numéro de rue requis.' }),
  street: z.string({ required_error: 'Nom de rue requis.' }),
  zip: z.string({ required_error: 'Code postal requis.' }),
  city: z.string({ required_error: 'Ville requise.' }),
  state: z.string({ required_error: 'Région/état requis.' }),
  country: z.string({ required_error: 'Pays requis.' }),
  geoapifyId: z.string().nullable(),
});
