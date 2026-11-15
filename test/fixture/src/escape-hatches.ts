export function parse(input: any): string {
  // @ts-ignore
  const value: string | undefined = input.name;
  console.log(value);
  return value!;
}
