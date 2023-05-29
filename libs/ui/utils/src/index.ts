// @index(['./**/*.{ts,tsx}', './*/index.{ts,tsx}'], f => `export * from '${f.path.replace(/\/index$/, '')}'`)
export * from './actor-image/get-actor-image';
export * from './link/deactivate-link';
export * from './tenant/current-tenant';
// @endindex
