export interface LinearEngine<T> {
    run(...args: any[]): void;
    get pseudocode(): string;
}

export interface Snapshot<T> {
    pointers: object; // indices of interest
    label: string;
    algorithmLine: number;
}

export interface Pointers {
    [key: string]: number;
}

export abstract class LinearSnapshot<T> implements Snapshot<T> {
    constructor(
        public array: T[],
        public pointers: Pointers, 
        public label: string,
        public algorithmLine: number
        ) { }
}