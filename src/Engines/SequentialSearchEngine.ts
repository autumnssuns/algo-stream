import { Tracker } from "../Models/Utils";
import { SearchEngine } from "./SearchEngine";

export class SequentialSearchSnapshot<T> {
    constructor(
        public array: T[], 
        public value: T, 
        public index: number, 
        public label: string
        ) { }
}

export class SequentialSearchEngine<T> implements SearchEngine<T> {
    constructor(
        public tracker: Tracker<SequentialSearchSnapshot<T>>, 
        public compare: (a: T, b: T) => number) { }

    search(array: T[], value: T): number {
        this.tracker.record(new SequentialSearchSnapshot(array, value, -1, `Algorithm starts`));
        let i: number;
        for (i = 0; i < array.length; i++) {
            this.tracker.record(new SequentialSearchSnapshot(array, value, i, `Check ${array[i]} == ${value}`));
            if (this.compare(array[i], value) === 0) {
                this.tracker.record(new SequentialSearchSnapshot(array, value, i, `${value} found. Return ${i}`));
                this.tracker.isComplete = true;
                return i;
            }
        }
        this.tracker.record(new SequentialSearchSnapshot(array, value, i, `${value} not found. Return -1`));
        this.tracker.isComplete = true;
        return -1;
    }

    public get pseudocode(): string {
        return `algorithm sequentialSearch(array, value)
        // Input: An array of n elements and a value to search for
        // Output: The index of the value in the array or -1 if not found
        for i <- 0 to n - 1 do
            if array[i] = value then
                return i
        return -1
        `;
    }
}