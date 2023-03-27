export interface LinearEngine<T> {
    run(...args: any[]): void;
    get pseudocode(): string;
}

export interface Snapshot<T> {
    pointers: Pointers; // indices of interest
    extra: Extra | null; // extra memory
    label: string;
    algorithmLine: number;
}

export interface Pointers {
    [key: string]: number;
}

export interface Extra {
    [key: string]: {
        [key: string]: any;
        pointers: Pointers;
    }
}

export abstract class LinearSnapshot<T> implements Snapshot<T> {
    constructor(
        public array: T[],
        public pointers: Pointers, 
        public extra: Extra | null,
        public label: string,
        public algorithmLine: number
        ) { }
}