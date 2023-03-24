import { SequentialSearchEngine, SequentialSearchSnapshot } from './SequentialSearchEngine';
import { Tracker } from "../Models/Utils";
import { BinarySearchEngine, BinarySearchSnapshot } from "./BinarySearchEngine";

export interface SearchEngine<T> {
    search(array: T[], value: T): number;
    get pseudocode(): string;
    compare: (a: T, b: T) => number;
}

export function useSearchEngine<T>(type: string, compare: (a: T, b: T) => number) {
    let tracker: Tracker<any>;
    let engine: SearchEngine<T>;
    let cursorColorMap: Map<string, string> = new Map<string, string>();
    switch(type){
        case "binary":
            tracker = new Tracker<BinarySearchSnapshot<T>>();
            engine = new BinarySearchEngine<T>(tracker, compare);
            cursorColorMap.set("low", "red");
            cursorColorMap.set("high", "blue");
            cursorColorMap.set("mid", "green");
            break;
        case "sequential":
            tracker = new Tracker<SequentialSearchSnapshot<T>>();
            engine = new SequentialSearchEngine<T>(tracker, compare);
            cursorColorMap.set("index", "red");
            break;
        default:
            tracker = new Tracker<SequentialSearchSnapshot<T>>();
            engine = new SequentialSearchEngine<T>(tracker, compare);
            cursorColorMap.set("index", "red");
            break;
        }
    console.log(engine.pseudocode)
    return { engine, tracker, cursorColorMap};
}

