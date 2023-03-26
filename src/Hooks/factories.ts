import { SelectionSortEngine, SelectionSortSnapshot } from './../Engines/Sort/SelectionSortEngine';
import { BubbleSortEngine } from './../Engines/Sort/BubbleSortEngine';
import { Tracker } from "../Models/Utils";
import { LinearEngine, Snapshot } from "../Engines/AlgorithmEngine";
import { BinarySearchSnapshot, BinarySearchEngine } from "../Engines/Search/BinarySearchEngine";
import { SequentialSearchSnapshot, SequentialSearchEngine } from "../Engines/Search/SequentialSearchEngine";
import { BubbleSortSnapshot } from "../Engines/Sort/BubbleSortEngine";
import { InsertionSortEngine, InsertionSortSnapshot } from '../Engines/Sort/InsertionSortEngine';

export function createSearchEngine<T>(type: string, compare: (a: T, b: T) => number) {
    let tracker: Tracker<Snapshot<T>>;
    let engine: LinearEngine<T>;
    let cursorColorMap: Map<string, string> = new Map<string, string>();
    switch(type){
        case "binary":
            tracker = new Tracker<BinarySearchSnapshot<T>>();
            engine = new BinarySearchEngine<T>(tracker, compare);
            cursorColorMap.set("low", "red");
            cursorColorMap.set("high", "blue");
            cursorColorMap.set("mid", "purple");
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
    return { engine, tracker, cursorColorMap};
}

export function createSortEngine<T>(type: string, compare: (a: T, b: T) => number) {
    let tracker: Tracker<Snapshot<T>>;
    let engine: LinearEngine<T>;
    let cursorColorMap: Map<string, string> = new Map<string, string>();
    switch(type){
        case "bubble":
            tracker = new Tracker<BubbleSortSnapshot<T>>();
            engine = new BubbleSortEngine<T>(tracker, compare);
            cursorColorMap.set("current", "red");
            cursorColorMap.set("next", "blue");
            break;
        case "selection":
            tracker = new Tracker<SelectionSortSnapshot<T>>();
            engine = new SelectionSortEngine<T>(tracker, compare);
            cursorColorMap.set("min", "red");
            cursorColorMap.set("position", "blue");
            cursorColorMap.set("index", "purple");
            break;
        case "insertion":
            tracker = new Tracker<InsertionSortSnapshot<T>>();
            engine = new InsertionSortEngine<T>(tracker, compare);
            cursorColorMap.set("index", "red");
            cursorColorMap.set("insert", "blue");
            cursorColorMap.set("key", "black");
            break;
        default:
            tracker = new Tracker<BubbleSortSnapshot<T>>();
            engine = new BubbleSortEngine<T>(tracker, compare);
            cursorColorMap.set("current", "red");
            cursorColorMap.set("next", "blue");
            break;
        }
    return { engine, tracker, cursorColorMap};
}