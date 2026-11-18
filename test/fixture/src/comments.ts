// A line comment.
/* A block comment. */
/** A doc comment. */
export function double(value: number): number {
  return value * 2;
}

// prettier-ignore
export const matrix = [1,0,
                       0,1];

export async function load(): Promise<unknown> {
  return import(/* webpackChunkName: "page" */ "./clean.js");
}
