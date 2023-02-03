export type Exact<A, B> = A extends B ? (B extends A ? A : never) : never;
