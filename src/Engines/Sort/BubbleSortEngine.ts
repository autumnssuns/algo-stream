import { Tracker } from "../../Models/Utils";
import { Pointers, Snapshot } from "../AlgorithmEngine";
import { SortEngine } from "./SortEngine";


export class BubbleSortSnapshot<T> implements Snapshot<T> {
    constructor(
        public array: T[],
        public pointers: Pointers, 
        public label: string,
        public algorithmLine: number
        ) { }
}

export class BubbleSortEngine<T> extends SortEngine<T> {
    constructor(tracker: Tracker<Snapshot<T>>, compare: (a: T, b: T) => number) {
        super(tracker, compare);
    }

    sort(array: T[]): void {
        const quickAddRecord = (label: string, algorithmLine: number, current: number, next: number) => {
            this.tracker.record(new BubbleSortSnapshot([...array], {current: current, next: next}, label, algorithmLine));
        }
        // double for loop
        quickAddRecord(`Algorithm starts`, 0, -1, -1);
        for (let i = 0; i < array.length - 1; i++) {
            quickAddRecord(`Let current index i = ${i}`, 1, -1, -1);
            for (let j = 0; j < array.length - i - 1; j++) {
                quickAddRecord(`Let current index j = ${j}`, 2, j, j + 1);
                quickAddRecord(`Check if ${array[j]} > ${array[j + 1]}`, 3, j, j + 1);
                if (this.compare(array[j], array[j + 1]) > 0) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    quickAddRecord(`True. Swap ${array[j]} and ${array[j + 1]}`, 4, j + 1, j);
                } else {
                    quickAddRecord(`False. Continue`, 3, j, j + 1);
                }
            }
        }
        quickAddRecord(`Algorithm ends`, 5, 0, 0);
        this.tracker.isComplete = true;
    }

    public get pseudocode(): string {
        return `algorithm bubbleSort(array)
    for i <- 0 to n - 2 do
        for j <- 0 to n - 2 - i do
            if array[j] > array[j + 1] then
                swap array[j] and array[j + 1]
    return`;
    }
}