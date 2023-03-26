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
        let swapped: boolean = false;
        const quickAddRecord = (label: string, algorithmLine: number, current: number, next: number) => {
            this.tracker.record(new BubbleSortSnapshot([...array], {current: current, next: next}, label, algorithmLine));
        }
        quickAddRecord(`Algorithm starts`, 0, -1, -1);
        do {
            quickAddRecord(`Set swapped to false`, 2, -1, -1);
            swapped = false;
            for (let i = 0; i < array.length - 1; i++) {
                quickAddRecord(`Let current index i = ${i}`, 3, i, i + 1);
                quickAddRecord(`Check if ${array[i]} > ${array[i + 1]}`, 4, i, i + 1);
                if (this.compare(array[i], array[i + 1]) > 0) {
                    quickAddRecord(`True. Swap ${array[i]} and ${array[i + 1]}`, 5, i, i + 1);
                    [array[i], array[i + 1]] = [array[i + 1], array[i]];
                    quickAddRecord(`Set swapped to true`, 6, i + 1, i);
                    swapped = true;
                }
                quickAddRecord(`Continue to next iteration`, 3, i, i + 1);
            }
            quickAddRecord(`Swapped = ${swapped}. ${swapped ? 'Continue' : 'End'}`, 1, -1, -1);
        } while (swapped);
        quickAddRecord(`Algorithm ends`, 8, -1, -1);
        this.tracker.isComplete = true;
    }

    public get pseudocode(): string {
        return `algorithm bubbleSort(array)
    do
        swapped = false
        for i <- 0 to n - 2 do
            if array[i] > array[i + 1] then
                swap(array[i], array[i + 1])
                swapped = true
    while swapped
    return`;
    }
}