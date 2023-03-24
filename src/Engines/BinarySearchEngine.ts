import { Tracker } from "../Models/Utils";
import { SearchEngine } from "./SearchEngine";

export class BinarySearchSnapshot<T> {
    constructor(
        public array: T[],
        public value: T,
        public low: number,
        public high: number,
        public mid: number | null,
        public label: string
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
        // Input: A sorted array of n elements and a value to search for
        // Output: The index of the value in the array or -1 if not found
        low <- 0
        high <- n - 1
        while low <= high do
            mid <- floor((low + high) / 2)
            if array[mid] < value then
                low <- mid + 1
            else if array[mid] > value then
                high <- mid - 1
            else:
                return mid
        return -1
        `;
    }
    search(array: T[], value: T): number {
        this.tracker.record(new BinarySearchSnapshot(array, value, 0, array.length - 1, null, `Algorithm starts`));
        let low = 0;
        let high = array.length - 1;
        let mid: number | null = null;
        this.tracker.record(new BinarySearchSnapshot(array, value, low, high, mid, `Initialize low = ${low}, high = ${high}`));
        while (low <= high) {
            this.tracker.record(new BinarySearchSnapshot(array, value, low, high, mid, `Check if ${low} <= ${high}`));
            mid = Math.floor((low + high) / 2);
            this.tracker.record(new BinarySearchSnapshot(array, value, low, high, mid, `Set mid = ${mid}`));
            if (this.compare(array[mid], value) < 0) {
                this.tracker.record(new BinarySearchSnapshot(array, value, low, high, mid, `Check if ${array[mid]} < ${value}`));
                low = mid + 1;
                this.tracker.record(new BinarySearchSnapshot(array, value, low, high, mid, `Set low = ${low}`));
            } else if (this.compare(array[mid],value) > 0) {
                this.tracker.record(new BinarySearchSnapshot(array, value, low, high, mid, `Check if ${array[mid]} > ${value}`));
                high = mid - 1;
                this.tracker.record(new BinarySearchSnapshot(array, value, low, high, mid, `Set high = ${high}`));
            } else {
                this.tracker.record(new BinarySearchSnapshot(array, value, low, high, mid, `${value} found. Return ${mid}`));
                this.tracker.isComplete = true;
                return mid;
            }
        }
        this.tracker.record(new BinarySearchSnapshot(array, value, low, high, mid, `${value} not found. Return -1`));
        this.tracker.isComplete = true;
        return -1;
    }
}