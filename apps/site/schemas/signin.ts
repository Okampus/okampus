import { z } from 'zod';

export const signinSchema = z.object({
  username: z.string().min(1, { message: "Nom d'utilisateur requis" }),
  password: z.string().min(1, { message: 'Mot de passe requis' }),
});
