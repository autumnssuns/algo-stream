import { Tracker } from "../../Models/Utils";
import { Pointers, Snapshot } from "../AlgorithmEngine";
import { SearchEngine } from "./SearchEngine";

export class SequentialSearchSnapshot<T> implements Snapshot<T> {
    constructor(
        // public array: T[], 
        public value: T, 
        public pointers: Pointers, 
        public label: string,
        public algorithmLine: number
        ) { }
}

export class SequentialSearchEngine<T> extends SearchEngine<T> {
    constructor(tracker: Tracker<any>, compare: (a: T, b: T) => number) {
        super(tracker, compare);
    }

    search(array: T[], value: T): number {
        let i: number = -1;
        const quickAddRecord = (label: string, algorithmLine: number) => {
            this.tracker.record(new SequentialSearchSnapshot(value, {index: i}, label, algorithmLine));
        }
        quickAddRecord(`Algorithm starts`, 0)
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