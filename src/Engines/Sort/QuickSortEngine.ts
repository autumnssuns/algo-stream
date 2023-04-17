import { Tracker } from "../../Models/Utils";
import { Extra, Pointers, Snapshot } from "../AlgorithmEngine";
import { SortEngine } from "./SortEngine";

export class QuickSortSnapshot<T> implements Snapshot<T> {
    constructor(
        public array: T[],
        public pointers: Pointers, 
        public extra: null,
        public label: string,
        public algorithmLine: number
        ) { }
}

export class QuickSortEngine<T> extends SortEngine<T> {
    constructor(tracker: Tracker<Snapshot<T>>, compare: (a: T, b: T) => number) {
        super(tracker, compare);
    }

    sort(array: T[]): void {
        const quickAddRecord = (label: string, algorithmLine: number, left: number, right: number, pivot: number, i: number, j: number) => {
            this.tracker.record(
                new QuickSortSnapshot(
                    [...array], 
                    {left: left, right: right, pivot: pivot, i: i, j: j}, 
                    null, 
                    label, 
                    algorithmLine
                    )
                );
        }

        const swap = (array: T[], i: number, j: number): void => {
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        const partition = (array: T[], left: number, right: number): number => {
            let pivotIndex = left;
            let pivot = array[pivotIndex];
            let i = left;
            let j = right + 1;
            const quickAdd = (label: string, algorithmLine: number) => {
                quickAddRecord(label, algorithmLine, pivotIndex, right, left, i, j);
            }
            do {
                do {
                    quickAdd(`Increasing i from ${i} to ${i + 1}`, 1);
                    i++;
                    quickAdd(`Is ${array[i]} >= ${pivot}? ${this.compare(array[i], pivot) >= 0} -> ${this.compare(array[i], pivot) >= 0 ? 'Exit' : 'Continue'}`, 1);
                } while (this.compare(array[i], pivot) === -1);
                do {
                    quickAdd(`Decreasing j from ${j} to ${j - 1}`, 1);
                    j--;
                    quickAdd(`Is ${array[j]} <= ${pivot}? ${this.compare(array[j], pivot) <= 0} -> ${this.compare(array[j], pivot) <= 0 ? 'Exit' : 'Continue'}`, 1);
                } while (this.compare(array[j], pivot) === 1);
                quickAdd(`Swapping ${array[i]} and ${array[j]}`, 2);
                swap(array, i, j);
                quickAdd(`Is i (${i}) >= j (${j})? ${i >= j} -> ${i >= j ? 'Exit' : 'Continue'}`, 1);
            } while (i < j);
            quickAdd(`Undo last: Swapping ${array[i]} and ${array[j]}`, 2);
            swap(array, i, j);
            pivotIndex = j;
            quickAdd(`Moving pivot ${pivot} to position ${pivotIndex}: Swapping ${array[left]} and ${array[pivotIndex]}`, 3);
            swap(array, left, pivotIndex);
            return pivotIndex;
        }

        const quickSort = (array: T[], left: number, right: number): void => {
            let pivot = -1;
            const quickAdd = (label: string, algorithmLine: number) => {
                quickAddRecord(label, algorithmLine, left, right, pivot, -1, -1);
            }
            if (left < right) {
                quickAdd(`Partitioning array from ${left} to ${right}`, 0);
                pivot = partition(array, left, right);
                quickAdd(`Recursively sorting left subarray from ${left} to ${pivot - 1}`, 4);
                quickSort(array, left, pivot - 1);
                quickAdd(`Recursively sorting right subarray from ${pivot + 1} to ${right}`, 4);
                quickSort(array, pivot + 1, right);
            }
        }

        quickAddRecord(`Algorithm starts`, 0, -1, -1, -1, -1, -1);
        quickSort(array, 0, array.length - 1);
        quickAddRecord(`Algorithm ends`, 5, -1, -1, -1, -1, -1);
        this.tracker.isComplete = true;
    }

    public get pseudocode(): string {
        return `algorithm quickSort(array, left, right)
    if left < right then
        pivot <- partition(array, left, right)
        quickSort(array, left, pivot - 1)
        quickSort(array, pivot + 1, right)
    return
    
algorithm partition(array, left, right)
    pivot <- array[left]
    i <- left - 1
    j <- right + 1
    repeat
        repeat
            i <- i + 1
        until array[i] >= pivot
        repeat
            j <- j - 1
        until array[j] <= pivot
        swap array[i] and array[j]
    until i >= j
    swap array[i] and array[j]
    swap array[left] and array[j]
    return j
    `
    ;
    }
}