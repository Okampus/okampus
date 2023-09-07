export type KeyStartsWith<T extends object, S extends string> = keyof {
  [K in keyof T as K extends `${S}${infer R}` ? K : never]: never;
};
