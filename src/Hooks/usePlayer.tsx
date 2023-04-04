import React, { useEffect } from "react";
import { Tracker } from "../Models/Utils";
import { Snapshot } from "../Engines/AlgorithmEngine";
import { getSyntaxClass } from "../Models/SyntaxFormat";

interface Props {
  tracker: Tracker<Snapshot<number>>;
}

export function usePlayer({ tracker }: Props) {
  const [sliderValue, setSliderValue] = React.useState(0);
  const [maxSliderValue, setMaxSliderValue] = React.useState(100);

  const [trackerState, setTrackerState] = React.useState(tracker);
  const [pseudocodeState, setPseudocodeState] = React.useState<string>("");
  const [highlightedCodeLine, setHighlightedCodeLine] =
    React.useState<number>(0);
  const [highlightedLabelLine, setHighlightedLabelLine] =
    React.useState<number>(0);
  const labelDiv = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const snapshot = trackerState.getSnapshot(sliderValue);
    if (snapshot) {
      setHighlightedCodeLine(snapshot.algorithmLine);
      setHighlightedLabelLine(sliderValue);
      // Scroll to the bottom of ref
      if (labelDiv.current) {
        labelDiv.current.scrollTop = labelDiv.current.scrollHeight;
      }
    }
  });

  const explanationJsx = (
    <div>
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
      <div className="explanation-container">
        <div className="labels-container" ref={labelDiv}>
          {trackerState.log
            .filter((log, index) => index <= sliderValue)
            .map((log, index) => {
              const highlightClass =
                index === highlightedLabelLine ? "line-highlight" : "";
              return (
                <span key={index} className={`label ${highlightClass}`}>
                  {log.label}
                </span>
              );
            })}
        </div>
        <div className="pseudocode-container">
          {pseudocodeState.split("\n").map((line, index) => {
            let highlightClass =
              index === highlightedCodeLine ? "line-highlight" : "";
            // Get leading spaces
            let leadingSpaces = line.match(/^\s*/);
            if (leadingSpaces) {
              line = line.replace(/^\s*/, "");
            }
            return (
              <div key={index} className={`pseudocode-line ${highlightClass}`}>
                <span className="line-number">{index + 1}</span>
                <span className="leading-spaces">{leadingSpaces}</span>
                {line.split(" ").map((word, index) => {
                  let syntaxClass = getSyntaxClass(word);
                  return (
                    <span key={index} className={syntaxClass}>
                      {word}
                      {index !== line.split(" ").length - 1 ? " " : ""}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return {
    sliderValue,
    setSliderValue,
    maxSliderValue,
    setMaxSliderValue,
    trackerState,
    setTrackerState,
    setPseudocodeState,
    explanationJsx,
  }
}
