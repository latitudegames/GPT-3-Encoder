declare module "gpt-3-encoder" {
  export function encode(text: string): string[];

  export function decode(tokens: string[]): string;
}
