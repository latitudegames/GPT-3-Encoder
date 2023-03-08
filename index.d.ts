declare module "gpt-3-encoder" {
    export function encode(text: string): number[];

    export function decode(tokens: number[]): string;

    export function countTokens(text: string): number;

    export function tokenStats(input: string | number[]): TokenStats;

    export interface TokenStats {
        count: number;
        unique: number;
        frequency: Record<string, number>;
        positions: Record<string, number[]>;
        tokens: string[];
    }

}
