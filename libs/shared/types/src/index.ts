// @index(['./**/*.{ts,tsx}', './*/index.{ts,tsx}'], f => `export * from '${f.path.replace(/\/index$/, '')}'`)
export * from './interfaces/bll/multer-file.interface';
export * from './interfaces/config/api-config.interface';
export * from './interfaces/cookie';
export * from './interfaces/cursor-columns.interface';
export * from './interfaces/error-filter-response.interface';
export * from './interfaces/full-page-info.interface';
export * from './interfaces/global/file-like';
export * from './interfaces/global/file-mime-check-payload';
export * from './interfaces/snowflake';
export * from './interfaces/token-claims.interface';
export * from './interfaces/ui/modal-props';
export * from './interfaces/ui/selected-menu';
export * from './interfaces/ui/toast-props';
export * from './interfaces/userinfo-response.interface';
export * from './scalars/query-order-map.scalar';
export * from './types/abstract-constructor.type';
export * from './types/deep-partial.type';
export * from './types/exact.type';
export * from './types/json.type';
export * from './types/only-either.type';
export * from './types/optional.type';
export * from './types/required-prop.type';
export * from './types/required.type';
// @endindex
