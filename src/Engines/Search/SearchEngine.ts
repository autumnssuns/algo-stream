import { Tracker } from "../../Models/Utils";
import { AlgorithmEngine, Snapshot } from '../AlgorithmEngine';

// export interface SearchEngine<T> {
//     search(array: T[], value: T): number;
//     get pseudocode(): string;
//     compare: (a: T, b: T) => number;
// }

export abstract class SearchEngine<T> implements AlgorithmEngine{
    protected tracker: Tracker<Snapshot<T>>;
    protected compare: (a: T, b: T) => number;
    constructor(tracker: Tracker<Snapshot<T>>, compare: (a: T, b: T) => number) {
        this.tracker = tracker;
        this.compare = compare;
    }
    run(array: T[], value: T): void {
        this.search(array, value);
    }
    abstract search(array: T[], value: T): number;
    abstract get pseudocode(): string;
}

