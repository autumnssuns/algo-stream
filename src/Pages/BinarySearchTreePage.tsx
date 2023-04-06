import { useState, useEffect } from "react";
import { BinarySearchTree } from "../Models/DataStructures/BinarySearchTree";
import { GraphVisualiser } from "../Components/GraphVisualiser";
import { createBinarySearchTreeEngine } from "../Hooks/factories";
import { usePlayer } from "../Hooks/usePlayer";
import { AlgorithmEngine, BinarySearchTreeSnapshot } from "../Engines/AlgorithmEngine";
import { BinarySearchTreeInsertSnapshot } from "../Engines/BinarySearchTree/InsertEngine";
import { Tracker } from "../Models/Utils";

interface BinarySearchTreePageProps {
  engine: AlgorithmEngine;
  tracker: Tracker<BinarySearchTreeInsertSnapshot>;
  cursorColorMap: Map<string, string>;
}

export function BinarySearchTreePage({engine, tracker, cursorColorMap}: BinarySearchTreePageProps) {
    const [ treeState, setTreeState] = useState(new BinarySearchTree());

    const {
        sliderValue,
        setSliderValue,
        maxSliderValue,
        setMaxSliderValue,
        trackerState,
        setTrackerState,
        setPseudocodeState,
        explanationJsx,
      } = usePlayer({
        tracker: tracker,
      });

    useEffect(() => {
        setTrackerState(tracker);
        setMaxSliderValue(tracker.size - 1);
        setPseudocodeState(engine.pseudocode);
    }, [])

    useEffect(() => {
        setMaxSliderValue(tracker.size - 1);
    }, [tracker.isComplete])

    useEffect(() => {
        const snapshot = tracker.getSnapshot(sliderValue) as BinarySearchTreeSnapshot;
        if (snapshot) {
            const colors: { index: number; color: string }[] = [];
            cursorColorMap.forEach((color, index) => {
                colors.push({
                    index: snapshot.pointers[index],
                    color: color,
                });
            });
            setTreeState(snapshot.binarySearchTree);
        }
    }, [sliderValue])

    return (
        <div>
            <input type="number" id="insert" name="insert" />
            <button onClick=
              {() => {
                const input = document.getElementById('insert') as HTMLInputElement;
                const value = input.value;
                if (value) {
                  setTreeState((prev) => {
                    const rootCopy = prev.root ? prev.root.deepCopy(["visited", "current"]) : null;
                    const copy = new BinarySearchTree().fromNode(rootCopy);
                    engine.run(copy, parseInt(value));
                    console.log(tracker)
                    return (tracker.getSnapshot(tracker.size - 1) as BinarySearchTreeInsertSnapshot).binarySearchTree;
                  })
                }
              }}
            >Insert</button>
            <GraphVisualiser tree={treeState}/>
            {explanationJsx}
        </div>
    )
}