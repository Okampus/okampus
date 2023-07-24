type AsyncFunction = () => Promise<void>;
export async function chain(...validators: AsyncFunction[]) {
  for (const validator of validators) await validator();
  return;
}
