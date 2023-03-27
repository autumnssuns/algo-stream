import { Tracker } from "../../Models/Utils";
import { Pointers, Snapshot } from "../AlgorithmEngine";
import { SortEngine } from "./SortEngine";

export class SelectionSortSnapshot<T> implements Snapshot<T> {
    constructor(
        public array: T[], 
        public pointers: Pointers, 
        public label: string,
        public algorithmLine: number
        ) { }
}

export class SelectionSortEngine<T> extends SortEngine<T> {
    constructor(tracker: Tracker<any>, compare: (a: T, b: T) => number) {
        super(tracker, compare);
    }

    sort(array: T[]): void {
        let minIndex: number;
        let i: number;
        let j: number;
        const quickAddRecord = (label: string, algorithmLine: number) => {
            this.tracker.record(new SelectionSortSnapshot([...array], {min: minIndex, position: i, index: j}, label, algorithmLine));
        }
        quickAddRecord(`Algorithm starts`, 0);
        for (i = 0; i < array.length - 1; i++) {
            quickAddRecord(`Let current index i = ${i}`, 1);
            minIndex = i;
            quickAddRecord(`Let minIndex = ${minIndex}`, 2);
            for (j = i + 1; j < array.length; j++) {
                quickAddRecord(`Let current index j = ${j}`, 3);
                quickAddRecord(`Check if ${array[j]} < ${array[minIndex]}`, 4);
                if (this.compare(array[j], array[minIndex]) < 0) {
                    minIndex = j;
                    quickAddRecord(`Update minIndex = ${j}`, 5);
                }
                quickAddRecord(`Continue`, 4);
            }
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
            [minIndex, i] = [i, minIndex];
            quickAddRecord(`Swap ${array[i]} and ${array[minIndex]}`, 6);
            [minIndex, i] = [i, minIndex];
            quickAddRecord(`Continue to next position`, 1);
        }
        quickAddRecord(`Algorithm ends`, 7);
        this.tracker.isComplete = true;
    }

    public get pseudocode(): string {
        return `algorithm selectionSort(array)
    for i <- 0 to n - 2 do
        minIndex <- i
        for j <- i + 1 to n - 1 do
            if array[j] < array[minIndex] then
                minIndex <- j
        swap array[i] and array[minIndex]
    return`;
    }
}