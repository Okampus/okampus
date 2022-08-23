import { config } from '../../configs/config';

export default function RequireMeilisearch(): MethodDecorator {
  return (_target, _key, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const originalMethod: (...args: any[]) => unknown = descriptor.value;

    descriptor.value = function (...args: any[]): void {
      if (!config.meilisearch.enabled)
        return;
      return Reflect.apply(originalMethod, this, args);
    };

    return descriptor;
  };
}
