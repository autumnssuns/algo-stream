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
            (label: string, 
            algorithmLine: number,
            mid = -1,
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
            console.log(snapshot);
        }

        const merge = (array: T[], i: number, j: number, mid: number) => {
            let p = i;
            let q = mid + 1;
            let r = i;
            const temp = [...array];
            quickAddRecord(`Call merge(array, ${i}, ${j}, ${mid})`, 6, mid, p - i, q - mid - 1, r - i, array.slice(i, mid + 1), array.slice(mid + 1, j + 1), temp.slice(i, j + 1));
            while (p <= mid && q <= j) {
                quickAddRecord(`Check if ${array[p]} <= ${array[q]}?`, 7, mid, p - i, q - mid - 1, r - i, array.slice(i, mid + 1), array.slice(mid + 1, j + 1), temp.slice(i, j + 1));
                if (this.compare(array[p], array[q]) <= 0) {
                    quickAddRecord(`Yes, ${array[p]} <= ${array[q]}`, 8, mid, p - i, q - mid - 1, r - i, array.slice(i, mid + 1), array.slice(mid + 1, j + 1), temp.slice(i, j + 1));
                    temp[r] = array[p];
                    p++;
                    quickAddRecord(`temp[${r}] <- ${array[p - 1]}`, 9, mid, p - i, q - mid - 1, r - i, array.slice(i, mid + 1), array.slice(mid + 1, j + 1), temp.slice(i, j + 1));
                } else {
                    quickAddRecord(`No, ${array[p]} > ${array[q]}`, 10, mid, p - i, q - mid - 1, r - i, array.slice(i, mid + 1), array.slice(mid + 1, j + 1), temp.slice(i, j + 1));
                    temp[r] = array[q];
                    q++;
                    quickAddRecord(`temp[${r}] <- ${array[q - 1]}`, 11, mid, p - i, q - mid - 1, r - i, array.slice(i, mid + 1), array.slice(mid + 1, j + 1), temp.slice(i, j + 1));
                }
                r++;
                quickAddRecord(`r <- ${r}`, 12, mid, p - i, q - mid - 1, r - i, array.slice(i, mid + 1), array.slice(mid + 1, j + 1), temp.slice(i, j + 1));
            }
            quickAddRecord(`Check if p <= mid?`, 13, mid, p - i, q - mid - 1, r - i, array.slice(i, mid + 1), array.slice(mid + 1, j + 1), temp.slice(i, j + 1));
            if (p <= mid) {
                quickAddRecord(`Yes, p <= mid`, 14, mid, p - i, q - mid - 1, r - i, array.slice(i, mid + 1), array.slice(mid + 1, j + 1), temp.slice(i, j + 1));
                quickAddRecord(`temp[${r}..${j}] <- array[${p}..${mid}]`, 15, mid, p - i, q - mid - 1, r - i, array.slice(i, mid + 1), array.slice(mid + 1, j + 1), temp.slice(i, j + 1));
                for (let k = p; k <= mid; k++) {
                    temp[r] = array[k];
                    r++;
                    quickAddRecord(`temp[${r - 1}] <- ${array[k]}`, 16, mid, p - i, q - mid - 1, r - i, array.slice(i, mid + 1), array.slice(mid + 1, j + 1), temp.slice(i, j + 1));
                }
            }
            quickAddRecord(`Check if q <= j?`, 17, mid, p - i, q - mid - 1, r - i, array.slice(i, mid + 1), array.slice(mid + 1, j + 1), temp.slice(i, j + 1));
            if (q <= j) {
                quickAddRecord(`Yes, q <= j`, 18, mid, p - i, q - mid - 1, r - i, array.slice(i, mid + 1), array.slice(mid + 1, j + 1), temp.slice(i, j + 1));
                quickAddRecord(`temp[${r}..${j}] <- array[${q}..${j}]`, 19, mid, p - i, q - mid - 1, r - i, array.slice(i, mid + 1), array.slice(mid + 1, j + 1), temp.slice(i, j + 1));
                for (let k = q; k <= j; k++) {
                    temp[r] = array[k];
                    r++;
                    quickAddRecord(`temp[${r - 1}] <- ${array[k]}`, 20, mid, p - i, q - mid - 1, r - i, array.slice(i, mid + 1), array.slice(mid + 1, j + 1), temp.slice(i, j + 1));
                }
            }
            quickAddRecord(`array[${i}..${j}] <- temp[${i}..${j}]`, 21, mid, p - i, q - mid - 1, r - i, array.slice(i, mid + 1), array.slice(mid + 1, j + 1), temp.slice(i, j + 1));
            for (let k = i; k <= j; k++) {
                array[k] = temp[k];
                quickAddRecord(`array[${k}] <- ${temp[k]}`, 22, mid, p - i, q - mid - 1, r - i, array.slice(i, mid + 1), array.slice(mid + 1, j + 1), temp.slice(i, j + 1));
            }
            quickAddRecord(`Return`, 23, mid, p - i, q - mid - 1, r - i, array.slice(i, mid + 1), array.slice(mid + 1, j + 1), temp.slice(i, j + 1));
        }

        const mergeSort = (array: T[], i: number, j: number) => {
            let mid = -1;
            quickAddRecord(`Call mergeSort(array, ${i}, ${j})`, 2, -1, i, j, -1, [], [], array.slice(i, j + 1));
            if (i < j) {
                quickAddRecord(`Yes, i < j`, 3, -1, i, j, -1, [], [], array.slice(i, j + 1));
                mid = Math.floor((i + j) / 2);
                quickAddRecord(`mid <- (i + j) / 2`, 4, mid, i, j, -1, array.slice(i, mid + 1), array.slice(mid + 1, j + 1), array.slice(i, j + 1));
                mergeSort(array, i, mid);
                quickAddRecord(`Call mergeSort(array, ${i}, ${mid})`, 5, mid, i, j, -1, array.slice(i, mid + 1), array.slice(mid + 1, j + 1), array.slice(i, j + 1));
                mergeSort(array, mid + 1, j);
                quickAddRecord(`Call mergeSort(array, ${mid + 1}, ${j})`, 5, mid, i, j, -1, array.slice(i, mid + 1), array.slice(mid + 1, j + 1), array.slice(i, j + 1));
                merge(array, i, j, mid);
                quickAddRecord(`Call merge(array, ${i}, ${j}, ${mid})`, 6, mid, i, j, -1, array.slice(i, mid + 1), array.slice(mid + 1, j + 1), array.slice(i, j + 1));
            }
            quickAddRecord(`Return`, 24, -1, -1, -1, -1, [], [], array.slice(i, j + 1));
        }

        quickAddRecord(`Call mergeSort(array)`, 0, -1, -1, -1, -1, [], [], array);
        mergeSort(array, 0, array.length - 1);
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