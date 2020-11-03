declare module "gpt-3-encoder" {
  export function encode(text: string): number[];

  export function decode(tokens: number[]): string;
}
