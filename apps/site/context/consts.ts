export const API_URL = process.env.NEXT_PUBLIC_API_DOMAIN
  ? `https://${process.env.NEXT_PUBLIC_API_DOMAIN}`
  : 'http://localhost:8081';
export const HASURA_URL = process.env.NEXT_PUBLIC_HASURA_DOMAIN
  ? `https://${process.env.NEXT_PUBLIC_HASURA_DOMAIN}`
  : 'http://127.0.0.1:8080';
export const HASURA_WS_URL = process.env.NEXT_PUBLIC_HASURA_DOMAIN
  ? `ws://${process.env.NEXT_PUBLIC_HASURA_DOMAIN}`
  : 'ws://127.0.0.1:8080';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_DOMAIN
  ? `https://${process.env.NEXT_PUBLIC_SITE_DOMAIN}`
  : 'http://localhost:3000';
