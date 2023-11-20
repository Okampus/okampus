import z from 'zod';

export const searchAddressDto = z.object({ query: z.string(), limit: z.number().int().gte(0).lte(10).optional() });
