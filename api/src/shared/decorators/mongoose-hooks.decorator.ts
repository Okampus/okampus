import type { MongooseDocumentMiddleware } from 'mongoose';
import { HOOK_INFOS_KEY } from '../constants';

export const PreHook = (
  events: MongooseDocumentMiddleware | MongooseDocumentMiddleware[] | RegExp,
): ReturnType<typeof Reflect.metadata> => Reflect.metadata(HOOK_INFOS_KEY, { type: 'pre', events });

export const PostHook = (
  events: MongooseDocumentMiddleware | MongooseDocumentMiddleware[] | RegExp,
): ReturnType<typeof Reflect.metadata> => Reflect.metadata(HOOK_INFOS_KEY, { type: 'post', events });
