declare module 'papaparse' {
    export function parse(input: string | File, config?: object): any;
    export function unparse(data: any, config?: object): string;
}
