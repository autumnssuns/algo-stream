import React, { useEffect, useRef } from "react";
import ArrayVisualiser from "../Components/ArrayVisualiser";
import {
  Extra,
  LinearEngine,
  LinearSnapshot,
  Snapshot,
} from "../Engines/AlgorithmEngine";
import { getSyntaxClass } from "../Models/SyntaxFormat";
import { Tracker } from "../Models/Utils";
import "../Components/AlgorithmPlayer.css";
import { Comparable } from "../Models/DataTypes";
import { usePlayer } from "./usePlayer";

export function useLinearPlayer(
  array: Comparable[],
  displayMode: "bars" | "boxes",
  factory: () => {
    engine: LinearEngine<number>;
    tracker: Tracker<Snapshot<number>>;
    cursorColorMap: Map<string, string>;
  }
) {
  const [arrayState, setArrayState] = React.useState(array);
  const [pointerState, setPointerState] = React.useState<
    { index: number; color: string }[]
  >([]);

  const { engine, tracker, cursorColorMap } = factory();

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

  const [extraArraysState, setExtraArraysState] =
    React.useState<Extra | null>();
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  window.addEventListener("resize", () => setWindowWidth(window.innerWidth));

  // Update the array state when the slider value changes
  useEffect(() => {
    const snapshot = trackerState.getSnapshot(
      sliderValue
    ) as LinearSnapshot<number>;
    if (snapshot) {
      const colors: { index: number; color: string }[] = [];
      cursorColorMap.forEach((color, index) => {
        colors.push({
          index: snapshot.pointers[index],
          color: color,
        });
      });
      setPointerState(colors);
      if (snapshot.array) setArrayState(snapshot.array);
      setExtraArraysState(snapshot.extra);
    }
  }, [sliderValue]);

  let startButton = useRef<HTMLButtonElement>(null);
  // Start button handler
  const startButtonHandle = () => {
    const INTERVAL = 0;
    const button = startButton as unknown as HTMLButtonElement;
    button.disabled = true;
    setSliderValue(0);
    const intervalId = setInterval(() => {
      setSliderValue((prev) => {
        if (prev === maxSliderValue) {
          clearInterval(intervalId);
          button.disabled = false;
        }
        return prev + 1;
      });
    }, INTERVAL);
  };

  const jsx = (
    <div>
      <ArrayVisualiser
        array={arrayState}
        pointers={pointerState}
        windowWidth={windowWidth}
        displayMode={displayMode}
      />
      {extraArraysState ? <h2>Extra Space</h2> : null}
      <div className="extra-space-container">
        {
          // Filter out the extra arrays that are empty
          Object.keys(extraArraysState || {})
            .filter((key) => {
              return extraArraysState![key].array.length > 0;
            })
            .map((key, index) => {
              const extraArray = extraArraysState![key].array as [];
              const extraPointers = Object.keys(
                extraArraysState![key].pointers
              ).map((pointerKey) => {
                return {
                  index: extraArraysState![key].pointers[pointerKey],
                  color: cursorColorMap.get(pointerKey) || "black",
                };
              });

              const findMinMax = (
                array: Comparable[]
              ): [Comparable, Comparable] => {
                let min = array[0];
                let max = array[0];
                for (let i = 1; i < array.length; i++) {
                  if (array[i] < min) min = array[i];
                  if (array[i] > max) max = array[i];
                }
                return [min, max];
              };
              return (
                <div key={index} className="extra-space-group">
                  <h2>{key}</h2>
                  <ArrayVisualiser
                    array={extraArray}
                    pointers={extraPointers}
                    windowWidth={
                      (windowWidth / arrayState.length) *
                      extraArray.length *
                      0.4
                    }
                    displayMode={displayMode}
                    overrideMinMax={findMinMax(array)}
                  />
                </div>
              );
            })
        }
      </div>
      <button onClick={startButtonHandle} ref={startButton}>
        Start
      </button>
      <input
        type="range"
        min="0"
        max={maxSliderValue}
        value={sliderValue}
        onChange={(e) => setSliderValue(e.target.valueAsNumber)}
        step="1"
      />
      <button
        onClick={() =>
          setSliderValue((prev) => {
            if (prev === 0) return 0;
            return prev - 1;
          })
        }
      >
        Previous
      </button>
      <button
        onClick={() =>
          setSliderValue((prev) => {
            if (prev === maxSliderValue) return maxSliderValue;
            return prev + 1;
          })
        }
      >
        Next
      </button>
      {explanationJsx}
    </div>
  );

  return {
    setSliderValue,
    setArrayState,
    setTrackerState,
    setMaxSliderValue,
    setPseudocodeState,
    jsx,
  };
}
