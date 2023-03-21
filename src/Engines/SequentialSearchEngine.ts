import { IComparable } from "../Models/DataTypes";
import { Tracker } from "../Models/Utils";

export interface SearchEngine<T extends IComparable> {
    search(array: T[], value: T): number;
    get psedocode(): string;
}

export class SequentialSearchSnapshot<T extends IComparable> {
    constructor(public array: T[], public value: T, public index: number, public label: string) { }
}

export class SequentialSearchEngine<T extends IComparable> implements SearchEngine<T> {
    constructor(public tracker: Tracker<SequentialSearchSnapshot<T>>) { }

    search(array: T[], value: T): number {
        let i: number;
        for (i = 0; i < array.length; i++) {
            this.tracker.record(new SequentialSearchSnapshot(array, value, i, `Check ${array[i]} == ${value}`));
            if (array[i].compare(value) === 0) {
                this.tracker.record(new SequentialSearchSnapshot(array, value, i, `${value} found. Return ${i}`));
                this.tracker.isComplete = true;
                return i;
            }
        }
        this.tracker.record(new SequentialSearchSnapshot(array, value, i, `${value} not found. Return -1`));
        this.tracker.isComplete = true;
        return -1;
    }

    public get psedocode(): string {
        return `function sequentialSearch(array, value) {
    for i = 0 to array.length
        if array[i] == value
            return i
    return -1
}`;
    }
}

export class BinarySearchEngine<T extends IComparable> implements SearchEngine<T> {
    get psedocode(): string {
        return `function binarySearch(array, value) {
    let low = 0
    let high = array.length - 1
    while low <= high
        let mid = Math.floor((low + high) / 2)
        if array[mid] < value
            low = mid + 1
        else if array[mid] > value
            high = mid - 1
        else
            return mid
    return -1
}`;
    }
    search(array: T[], value: T): number {
        let low = 0;
        let high = array.length - 1;
        while (low <= high) {
            let mid = Math.floor((low + high) / 2);
            if (array[mid].compare(value) < 0) {
                low = mid + 1;
            } else if (array[mid].compare(value) > 0) {
                high = mid - 1;
            } else {
                return mid;
            }
        }
        return -1;
    }
}