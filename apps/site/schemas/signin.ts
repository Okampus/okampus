import { z } from 'zod';

export const signinSchema = z.object({
  next: z.string().optional(),
  username: z.string().min(1, { message: "Nom d'utilisateur requis" }),
  password: z.string().min(1, { message: 'Mot de passe requis' }),
});
