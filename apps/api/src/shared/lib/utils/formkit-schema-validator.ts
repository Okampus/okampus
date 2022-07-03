/* eslint-disable @typescript-eslint/no-use-before-define, unicorn/no-thenable */
import { z } from 'zod';

const formKitListValue = z.union([
  z.string(),
  z.record(z.any()),
  z.array(
    z.string()
    .or(z.number())
    .or(z.record(z.any())),
  ),
  z.number(),
]);

const formKitListStatement = z.union([
  z.tuple([
    z.any(),
    z.number().or(z.string()),
    formKitListValue,
  ]),
  z.tuple([
    z.any(),
    formKitListValue,
  ]),
]);

const formKitSchemaMeta: z.ZodType<unknown> = z.lazy(() =>
  z.record(
    z.string()
    .or(z.number())
    .or(z.boolean())
    .or(z.null())
    .or(z.undefined())
    .or(formKitSchemaMeta),
  ));

const formKitSchemaNode: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    formKitSchemaDOMNode,
    formKitSchemaComponent,
    formKitSchemaTextNode,
    formKitSchemaCondition,
    formKitSchemaFormKit,
  ]));

const formKitSchemaCondition = z.object({
  if: z.string(),
  then: formKitSchemaNode.or(formKitSchemaNode.array()),
  else: z.optional(formKitSchemaNode.or(formKitSchemaNode.array())),
});

const formKitSchemaAttributes: z.ZodType<unknown> = z.lazy(() =>
  z.union([
    formKitSchemaAttributesCondition,
    z.record(formKitAttributeValue),
    z.null(),
  ]));

const formKitSchemaAttributesCondition: z.ZodType<unknown> = z.lazy(() =>
  z.object({
    if: z.string(),
    then: formKitAttributeValue,
    else: z.optional(formKitAttributeValue),
  }));

const formKitAttributeValue = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.undefined(),
  formKitSchemaAttributes,
  formKitSchemaAttributesCondition,
]);

const formKitSchemaProps = z.object({
  children: z.optional(z.string().or(formKitSchemaNode.array()).or(formKitSchemaCondition)),
  key: z.optional(z.string()),
  if: z.optional(z.string()),
  for: z.optional(formKitListStatement),
  bind: z.optional(z.string()),
  meta: z.optional(formKitSchemaMeta),
});

const formKitSchemaDOMNode = z.object({
  $el: z.string().or(z.null()),
  attrs: z.optional(formKitSchemaAttributes),
}).merge(formKitSchemaProps);

const formKitSchemaTextNode = z.string();

const formKitSchemaComponent = z.object({
  $cmp: z.string(),
  props: z.optional(z.record(z.any())),
}).merge(formKitSchemaProps);

const formKitSchemaFormKit = z.object({
  $formkit: z.string(),
})
  .merge(formKitSchemaProps)
  .catchall(z.any());

const formKitSchema = formKitSchemaNode.array();

export function validateFormkit(form: unknown): form is object {
  return formKitSchema.safeParse(form).success;
}
