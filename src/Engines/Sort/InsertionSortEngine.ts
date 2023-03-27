import { Tracker } from "../../Models/Utils";
import { Extra, Pointers, Snapshot } from "../AlgorithmEngine";
import { SortEngine } from "./SortEngine";

export class InsertionSortSnapshot<T> implements Snapshot<T> {
    constructor(
        public array: T[],
        public pointers: Pointers, 
        public extra: Extra | null,
        public label: string,
        public algorithmLine: number
        ) { }
}

export class InsertionSortEngine<T> extends SortEngine<T> {
    constructor(tracker: Tracker<any>, compare: (a: T, b: T) => number) {
        super(tracker, compare);
    }

    sort(array: T[]): void {
        let i: number;
        let j: number;
        let key: T | undefined;
        const quickAddRecord = (label: string, algorithmLine: number) => {
            if (key !== undefined) {
                this.tracker.record(new InsertionSortSnapshot([...array], {index: i, insert: j, key: array.length}, {key: {array: [key], pointers: {key: 0}}}, label, algorithmLine));
            } else {
                this.tracker.record(new InsertionSortSnapshot([...array], {index: i, insert: j}, {}, label, algorithmLine));
            }
        }
        quickAddRecord(`Algorithm starts`, 0)
        for (i = 1; i < array.length; i++) {
            quickAddRecord(`Let current index i = ${i}`, 1);
            key = array[i];
            quickAddRecord(`Let key = ${array[i]}`, 2);
            j = i - 1;
            quickAddRecord(`Let j = ${j}`, 3);
            quickAddRecord(`Check if j = ${j} >= 0 and array[j] > key? (${array[j]} > ${key})`, 4);
            while (j >= 0 && this.compare(array[j], key) > 0) {
                quickAddRecord(`True. Shift ${array[j]} to the right`, 5);
                array[j + 1] = array[j];
                j = j - 1;
                quickAddRecord(`Let j = ${j}`, 6);
            }
            array[j + 1] = key;
            j++;
            quickAddRecord(`False. Insert ${key} into index ${j}`, 7);
        }
        this.tracker.isComplete = true;
        key = undefined;
        quickAddRecord(`Algorithm ends`, 8);
    }

    public get pseudocode(): string {
        return `algorithm insertionSort(array)
    for i <- 1 to n - 1 do
        key <- array[i]
        j <- i - 1
        while j >= 0 and array[j] > key do
            array[j + 1] <- array[j]
            j <- j - 1
        array[j + 1] <- key
    return`;
    }
}