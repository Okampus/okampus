import type { AnyZodObject, ZodObject, ZodRawShape } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UnionToIntersection<Union> = (Union extends any ? (k: Union) => void : never) extends (k: infer I) => void
  ? I
  : never;

type InferShape<Obj extends AnyZodObject> = Obj extends ZodObject<infer T> ? T : never;
export type MergeZodShape<Objs extends AnyZodObject[]> = UnionToIntersection<
  InferShape<Objs[number]>
> extends ZodRawShape
  ? UnionToIntersection<InferShape<Objs[number]>>
  : never;

export type MergedZodObject<Objs extends AnyZodObject[]> = ZodObject<MergeZodShape<Objs>>;

// create a typed mergeZodObjects function, with the output type being the union of all the input types
export function mergeZodObjectSchemas<Objs extends AnyZodObject[]>(schemas: Objs): MergedZodObject<Objs> {
  const [schema, ...rest] = schemas;
  let merged = schema;
  for (const element of rest) {
    merged = merged.merge(element);
  }

  return merged as MergedZodObject<Objs>;
}
