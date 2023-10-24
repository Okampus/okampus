import { searchAddresses } from '../../../database/prisma/services/geoapify';
import { searchAddressDto } from '../dtos/searchAddress';
import { protectedProcedure } from '../trpc';

export const searchAddress = protectedProcedure.input(searchAddressDto).query(async ({ input: { query, limit } }) => {
  return await searchAddresses(query, limit ?? 6);
});
