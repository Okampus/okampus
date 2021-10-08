/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { Type } from '@nestjs/common';
import { SchemaFactory } from '@nestjs/mongoose';
import type { MongooseDocumentMiddleware, Schema } from 'mongoose';
import { HOOK_INFOS_KEY } from '../constants';

type HookInfosMetadata =
  | { type: 'post' | 'pre'; events: MongooseDocumentMiddleware | MongooseDocumentMiddleware[] | RegExp }
  | undefined;

type Descriptors = Array<{ name: string; get: PropertyDescriptor['get']; set: PropertyDescriptor['set'] }>;

export function createSchemaForClass<T>(target: Type<T>): Schema<T> {
  const schema = SchemaFactory.createForClass<T>(target) as Schema<T>;
  const proto = target.prototype;

  // Get static methods
  const ownStaticMethods = Object.getOwnPropertyNames(target)
    .filter(prop => typeof Reflect.get(target, prop) === 'function');

  // Get instance methods
  const ownMethods = Object.getOwnPropertyNames(proto)
    .filter(prop => typeof Reflect.get(proto, prop) === 'function' && prop !== 'constructor');

  // Get instance getters and setters
  const ownDescriptors: Descriptors = [];
  for (const property of Object.getOwnPropertyNames(target)) {
    const descriptor = Object.getOwnPropertyDescriptor(target, property);
    if (typeof descriptor?.get === 'function' || typeof descriptor?.set === 'function') {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ownDescriptors.push({ name: property, get: descriptor.get, set: descriptor.set });
    }
  }

  // Add static methods
  for (const staticMethod of ownStaticMethods)
    schema.static(staticMethod, Reflect.get(target, staticMethod));

  // Add instance methods and hooks
  for (const method of ownMethods) {
    const metadata: HookInfosMetadata = Reflect.getOwnMetadata(HOOK_INFOS_KEY, proto, method);
    if (typeof metadata === 'undefined')
      schema.method(method, Reflect.get(proto, method));
    else if (metadata.type === 'pre')
      schema.pre(metadata.events, Reflect.get(proto, method));
    else if (metadata.type === 'post')
      schema.post(metadata.events, Reflect.get(proto, method));
  }

  // Add virtuals
  for (const descriptor of ownDescriptors) {
    const virtual = schema.virtual(descriptor.name);
    if (typeof descriptor.get === 'function')
      virtual.get(descriptor.get);
    if (typeof descriptor.set === 'function')
      virtual.set(descriptor.set);
  }

  return schema;
}
