// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ActionArgs = any[];

export default async function wrapAction(
  action: (...args: ActionArgs) => Promise<void>,
  ...actionArgs: ActionArgs
): Promise<void> {
  await action(...actionArgs);
  process.exit();
}
