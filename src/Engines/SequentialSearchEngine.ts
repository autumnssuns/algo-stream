import { Tracker } from "../Models/Utils";
import { SearchEngine } from "./SearchEngine";

export class SequentialSearchSnapshot<T> {
    constructor(
        // public array: T[], 
        public value: T, 
        public index: number, 
        public label: string,
        public algorithmLine: number
        ) { }
}

export class SequentialSearchEngine<T> implements SearchEngine<T> {
    constructor(
        public tracker: Tracker<SequentialSearchSnapshot<T>>, 
        public compare: (a: T, b: T) => number) { }

    search(array: T[], value: T): number {
        this.tracker.record(new SequentialSearchSnapshot(value, -1, `Algorithm starts`, 0));
        let i: number;
        const quickAddRecord = (label: string, algorithmLine: number) => {
            this.tracker.record(new SequentialSearchSnapshot(value, i, label, algorithmLine));
        }
        for (i = 0; i < array.length; i++) {
            quickAddRecord(`Let current index i = ${i}`, 1);
            quickAddRecord(`Check if ${array[i]} = ${value}`, 2);
            if (this.compare(array[i], value) === 0) {
                quickAddRecord(`Match found. Return ${i}`, 3);
                this.tracker.isComplete = true;
                return i;
            }
            quickAddRecord(`Not matched. Continue`, 2)
        }
        quickAddRecord(`No match found. Return -1`, 4);
        this.tracker.isComplete = true;
        return -1;
    }

    public get pseudocode(): string {
        return `algorithm sequentialSearch(array, value)
    for i <- 0 to n - 1 do
        if array[i] = value then
            return i
    return -1`;
    }
}