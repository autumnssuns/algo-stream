import { Tracker } from "../Models/Utils";
import { SearchEngine } from "./SearchEngine";

export class BinarySearchSnapshot<T> {
    constructor(
        // public array: T[],
        public value: T,
        public low: number,
        public high: number,
        public mid: number | null,
        public label: string,
        public algorithmLine: number
        ) { }
}

export class BinarySearchEngine<T> implements SearchEngine<T> {
    constructor(
        public tracker: Tracker<BinarySearchSnapshot<T>>,
        public compare: (a: T, b: T) => number
        ) { }
    // use mathematical style of pseudocode
    public get pseudocode(): string {
        return `algorithm binarySearch(array, value)
    low <- 0
    high <- n - 1
    while low <= high do
        mid <- floor((low + high) / 2)
        if array[mid] < value then
            low <- mid + 1
        else if array[mid] > value then
            high <- mid - 1
        else
            return mid
    return -1`;
    }

    search(array: T[], value: T): number {
        let low = -1;
        let high = -1;
        let mid = -1;
        const quickAddRecord = (label: string, algorithmLine: number) => {
            this.tracker.record(new BinarySearchSnapshot(value, low, high, mid, label, algorithmLine));
        }
        quickAddRecord(`Algorithm starts`, 0);
        low = 0;
        high = array.length - 1;
        quickAddRecord(`Initialize low = ${low}, high = ${high}`, 2);
        while (low <= high) {
            quickAddRecord(`Check if ${low} <= ${high}. True. Continue`, 3);
            mid = Math.floor((low + high) / 2);
            quickAddRecord(`Set mid = ${mid}`, 4);
            if (this.compare(array[mid], value) < 0) {
                quickAddRecord(`Compare: ${array[mid]} < ${value}`, 5);
                low = mid + 1;
                quickAddRecord(`Set low = ${low}`, 6);
            } else if (this.compare(array[mid],value) > 0) {
                quickAddRecord(`Compare: ${array[mid]} > ${value}`, 7);
                high = mid - 1;
                quickAddRecord(`Set high = ${high}`, 8);
            } else {
                quickAddRecord(`Match found.`, 9);
                quickAddRecord(`Return ${mid}`, 10);
                this.tracker.isComplete = true;
                return mid;
            }
        }
        quickAddRecord(`Check if ${low} <= ${high}. False. Stop`, 3);
        quickAddRecord(`${value} not found. Return -1`, 11);
        this.tracker.isComplete = true;
        return -1;
    }
}