import { Tracker } from "../../Models/Utils";
import { Extra, Pointers, Snapshot } from "../AlgorithmEngine";
import { SortEngine } from "./SortEngine";

export class MergeSortSnapshot<T> implements Snapshot<T> {
    constructor(
        public array: T[],
        public pointers: Pointers, 
        public extra: Extra,
        public label: string,
        public algorithmLine: number
        ) { }
}

export class MergeSortEngine<T> extends SortEngine<T> {
    constructor(tracker: Tracker<Snapshot<T>>, compare: (a: T, b: T) => number) {
        super(tracker, compare);
    }

    sort(array: T[]): void {
        const quickAddRecord = 
            (
                label: string, 
                algorithmLine: number,
                outer_left = -1,
                mid = -1,
                outer_right = -1,
                i = -1,
                j = -1,
                k = -1,
                left: T[],
                right: T[],
                merge: T[]
            ) => {
            const snapshot = new MergeSortSnapshot([...array], 
                {
                    mid: mid,
                    left: outer_left,
                    right: outer_right,
                }, 
                {
                    left: 
                    {
                        array: [...left], 
                        pointers: {left: i}
                    }, 
                    right: 
                    {
                        array: [...right], 
                        pointers: {right: j}
                    },
                    merge: {
                        array: [...merge],
                        pointers: {merge: k}
                    },
                }, 
                label, algorithmLine);
            this.tracker.record(snapshot);
        }

        const merge = (array: T[], i: number, j: number, mid: number) => {
            let p = i;
            let q = mid + 1;
            let r = i;
            const temp = [...array];
            const quickAdd = (label: string, algorithmLine: number) => {
                quickAddRecord(label, algorithmLine,i, mid, j, p - i, q - mid - 1, r - i, array.slice(i, mid + 1), array.slice(mid + 1, j + 1), temp.slice(i, j + 1));
            }

            quickAdd(`Call merge(array, ${i}, ${j}, ${mid})`, 6);
            while (p <= mid && q <= j) {
                quickAdd(`Check if ${array[p]} <= ${array[q]}?`, 7);
                if (this.compare(array[p], array[q]) <= 0) {
                    quickAdd(`Yes, ${array[p]} <= ${array[q]}`, 8);
                    temp[r] = array[p];
                    p++;
                    quickAdd(`temp[${r}] <- ${array[p - 1]}`, 9);
                } else {
                    quickAdd(`No, ${array[p]} > ${array[q]}`, 10);
                    temp[r] = array[q];
                    q++;
                    quickAdd(`temp[${r}] <- ${array[q - 1]}`, 11);
                }
                r++;
                quickAdd(`r <- ${r}`, 12);
            }
            quickAdd(`Check if p <= mid?`, 13);
            if (p <= mid) {
                quickAdd(`Yes, p <= mid`, 14);
                quickAdd(`temp[${r}..${j}] <- array[${p}..${mid}]`, 15);
                for (let k = p; k <= mid; k++) {
                    temp[r] = array[k];
                    r++;
                    quickAdd(`temp[${r - 1}] <- ${array[k]}`, 16);
                }
            }
            quickAdd(`Check if q <= j?`, 17);
            if (q <= j) {
                quickAdd(`Yes, q <= j`, 18);
                quickAdd(`temp[${r}..${j}] <- array[${q}..${j}]`, 19);
                for (let k = q; k <= j; k++) {
                    temp[r] = array[k];
                    r++;
                    quickAdd(`temp[${r - 1}] <- ${array[k]}`, 20);
                }
            }
            quickAdd(`array[${i}..${j}] <- temp[${i}..${j}]`, 21);
            for (let k = i; k <= j; k++) {
                array[k] = temp[k];
                quickAdd(`array[${k}] <- ${temp[k]}`, 22);
            }
            quickAdd(`Return`, 23);
        }

        const mergeSort = (array: T[], i: number, j: number) => {
            let mid = -1;
            const quickAdd = (label: string, algorithmLine: number) => {
                quickAddRecord(label, algorithmLine, i, mid, j, i, j, -1, [], [], array.slice(i, j + 1));
            }
            quickAdd(`Call mergeSort(array, ${i}, ${j})`, 2);
            if (i < j) {
                quickAdd(`Yes, i < j`, 3);
                mid = Math.floor((i + j) / 2);
                quickAdd(`mid <- (i + j) / 2`, 4);
                mergeSort(array, i, mid);
                quickAdd(`Call mergeSort(array, ${i}, ${mid})`, 5);
                mergeSort(array, mid + 1, j);
                quickAdd(`Call mergeSort(array, ${mid + 1}, ${j})`, 5);
                merge(array, i, j, mid);
                quickAdd(`Call merge(array, ${i}, ${j}, ${mid})`, 6);
            }
            quickAdd(`Return`, 24);
        }

        quickAddRecord(`Call mergeSort(array)`, 0, -1, -1, -1, -1, -1, -1, [], [], array);
        mergeSort(array, 0, array.length - 1);
        quickAddRecord(`Return`, 1, -1, -1, -1, -1, -1, -1, [], [], []);
    }

    public get pseudocode(): string {
        return `algorithm mergeSort(array[i..j])
    if i < j
        mid <- (i + j) / 2
        mergeSort(array[i..mid])
        mergeSort(array[mid + 1..j])
        merge(array[i..j], mid)
    return

algorithm merge(array[i..j], mid)
    p <- i
    q <- mid + 1
    r <- i
    temp <- array[i..j]
    while p <= mid and q <= j do
        if array[p] <= array[q]
            temp[r] <- array[p]
            p <- p + 1
        else
            temp[r] <- array[q]
            q <- q + 1
        r <- r + 1
    if p <= mid
        temp[r..j] <- array[p..mid]
    if q <= j
        temp[r..j] <- array[q..j]
    array[i..j] <- temp[i..j]
    return`;
    }
}