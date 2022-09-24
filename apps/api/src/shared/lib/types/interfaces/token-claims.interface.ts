export interface TokenClaims {
  sub: string;
  userType: 'bot' | 'usr';
  tokenType: string;
}
