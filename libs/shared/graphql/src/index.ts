// @index(['./**/*.{ts,tsx}', './*/index.{ts,tsx}'], f => `export * from '${f.path.replace(/\/index$/, '')}'`)
export * from './fragments/eventFragment';
export * from './fragments/orgFragment';
export * from './fragments/userFragment';
export * from './mutations/createEvent';
export * from './mutations/createEventApproval';
export * from './mutations/login';
export * from './mutations/updateEvent';
export * from './queries/getEvents';
// @endindex
