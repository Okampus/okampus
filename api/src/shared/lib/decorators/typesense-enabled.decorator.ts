import { config } from '../../../config';

// eslint-disable-next-line @typescript-eslint/naming-convention
export default function TypesenseEnabled(): MethodDecorator {
  return (_target, _key, descriptor: PropertyDescriptor): PropertyDescriptor => {
    const originalMethod: (...args: any[]) => unknown = descriptor.value;

    descriptor.value = function (...args: any[]): void {
      if (!config.get('typesenseEnabled'))
        return;
      Reflect.apply(originalMethod, this, args);
    };

    return descriptor;
  };
}
