import fastifyCookie from '@fastify/cookie';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import type { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { config } from '../../configs/config';
import type { TokenClaims } from '../types/interfaces/token-claims.interface';

export async function processToken(
  jwtService: JwtService,
  token: string,
  expectedClaims: Partial<TokenClaims>,
  expectedOptions: (decoded: TokenClaims) => JwtSignOptions,
): Promise<string> {
  if (!token)
    throw new UnauthorizedException('Token not provided');

  const unsignedToken = fastifyCookie.unsign(token, config.cookies.signature);
  if (!unsignedToken.valid || !unsignedToken.value)
    throw new BadRequestException('Invalid cookie signature');

  const decoded = jwtService.decode(unsignedToken.value) as TokenClaims;
  if (!decoded)
    throw new BadRequestException('Failed to decode JWT');

  if (!Object.entries(expectedClaims).every(([claim, value]) => decoded[claim as keyof TokenClaims] === value))
    throw new UnauthorizedException('Invalid token claims');

  try {
    await jwtService.verifyAsync<TokenClaims>(unsignedToken.value, expectedOptions(decoded));
  } catch {
    throw new UnauthorizedException('Falsified token');
  }

  return decoded.sub;
}
