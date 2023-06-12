// @index(['./**/*.{ts,tsx}', './*/index.{ts,tsx}'], f => `export * from '${f.path.replace(/\/index$/, '')}'`)
export * from './actors/get-avatar';
export * from './actors/get-banner';
export * from './link/deactivate-link';
export * from './tenant/current-tenant';
// @endindex
