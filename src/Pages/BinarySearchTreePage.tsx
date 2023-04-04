import { useState, useEffect } from "react";
import { BinarySearchTree } from "../Models/DataStructures/BinarySearchTree";
import { GraphVisualiser } from "../Components/GraphVisualiser";
import { createBinarySearchTreeEngine } from "../Hooks/factories";
import { usePlayer } from "../Hooks/usePlayer";
import { BinarySearchTreeSnapshot } from "../Engines/AlgorithmEngine";
import { BinarySearchTreeInsertSnapshot } from "../Engines/BinarySearchTree/InsertEngine";

export function BinarySearchTreePage(){
    const [ treeState, setTreeState] = useState(new BinarySearchTree());
    const { engine, tracker, cursorColorMap } = createBinarySearchTreeEngine("insertion");

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
        setTreeState((prev) => {
            engine.run(prev, 50);
            console.log(tracker)
            return (tracker.getSnapshot(tracker.size - 1) as BinarySearchTreeInsertSnapshot).binarySearchTree;
        })
    }, [])
  
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
                    engine.run(prev, parseInt(value));
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