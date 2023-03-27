import React, { useEffect, useRef } from "react";
import ArrayVisualiser from "../Components/ArrayVisualiser";
import { Extra, LinearEngine, LinearSnapshot, Snapshot } from "../Engines/AlgorithmEngine";
import { getSyntaxClass } from "../Models/SyntaxFormat";
import { Tracker } from "../Models/Utils";
import '../Components/AlgorithmPlayer.css'

export function useLinearPlayer(
    array: number[], 
    displayMode: "bars" | "boxes",
    factory: () => {
        engine: LinearEngine<number>, 
        tracker: Tracker<Snapshot<number>>, 
        cursorColorMap: Map<string, string>}
    ){
    const [sliderValue, setSliderValue] = React.useState(0);
    const [maxSliderValue, setMaxSliderValue] = React.useState(100);
    const [arrayState, setArrayState] = React.useState(array);
    const [pointerState, setPointerState] = React.useState<{ index: number; color: string }[]>([]);

    const { engine, tracker, cursorColorMap } = factory();

    const [trackerState, setTrackerState] = React.useState(tracker);
    const [pseudocodeState, setPseudocodeState] = React.useState<string>("");
    const [highlightedCodeLine, setHighlightedCodeLine] = React.useState<number>(0);
    const [highlightedLabelLine, setHighlightedLabelLine] = React.useState<number>(0);
    const [extraArraysState, setExtraArraysState] = React.useState<Extra | null>();
    const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
    window.addEventListener("resize", () => setWindowWidth(window.innerWidth));

    const labelDiv = React.useRef<HTMLDivElement>(null);

    // Update the array state when the slider value changes
    useEffect(() => {
        const snapshot = trackerState.getSnapshot(sliderValue) as LinearSnapshot<number>;
        if (snapshot) {
            const colors: {index: number, color: string}[] = [];
            cursorColorMap.forEach((color, index) => {
                colors.push({
                    index: snapshot.pointers[index],
                    color: color,
                });
            });
            setPointerState(colors);
            if (snapshot.array) setArrayState(snapshot.array);
            setExtraArraysState(snapshot.extra);
            setHighlightedCodeLine(snapshot.algorithmLine);
            setHighlightedLabelLine(sliderValue);
            // Scroll to the bottom of ref
            if (labelDiv.current) {
                labelDiv.current.scrollTop = labelDiv.current.scrollHeight;
            }
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
            })
        }, INTERVAL);
    }

    const jsx = (<div>
        <ArrayVisualiser 
            array={arrayState} 
            pointers={pointerState} 
            windowWidth={windowWidth}
            displayMode={displayMode}
        />
        {
            extraArraysState ? <h2>Extra Space</h2> : null
        }
        <div className="extra-space-container">
            {
                Object.keys(extraArraysState || {}).map((key, index) => {
                    const extraArray = extraArraysState![key].array as [];
                    console.log(key, extraArray)
                    const extraPointers = Object.keys(extraArraysState![key].pointers).map((pointerKey) => {
                        return {
                            index: extraArraysState![key].pointers[pointerKey],
                            color: cursorColorMap.get(pointerKey) || "black"
                        }
                    });

                    return (
                        <div key={index}
                        className="extra-space-group"
                        >
                            <h2>{key}</h2>
                            <ArrayVisualiser 
                                array={extraArray}
                                pointers={extraPointers}
                                windowWidth={windowWidth / arrayState.length * extraArray.length}
                                displayMode={displayMode}
                                overrideMinMax={[Math.min(...array), Math.max(...array)]}
                            />
                        </div>
                    )
                })
            }
        </div>
        <button onClick={startButtonHandle} ref={startButton}
        >Start</button>
        <input type="range" min="0" 
            max={maxSliderValue} 
            value={sliderValue} 
            onChange={(e) => setSliderValue(e.target.valueAsNumber)} 
            step="1"
        />
        <button onClick={() => setSliderValue(prev => {
            if (prev === 0) return 0;
            return prev - 1;
        })}>
            Previous
        </button>
        <button onClick={() => setSliderValue(prev => {
            if (prev === maxSliderValue) return maxSliderValue;
            return prev + 1;
        })}>
            Next
        </button>
        <div className="explanation-container">
            <div className="labels-container"
            ref={labelDiv}
            >
                {
                trackerState.log.filter((log, index) => index <= sliderValue).map((log, index) => {
                    const highlightClass = index === highlightedLabelLine ? 'line-highlight' : '';
                    return (
                    <span key={index} className={`label ${highlightClass}`}>
                        {log.label}
                    </span>
                    );
                })
                }
            </div>
            <div className='pseudocode-container'>
                {
                    pseudocodeState.split('\n').map((line, index) => {
                        let highlightClass = index === highlightedCodeLine ? 'line-highlight' : '';
                        // Get leading spaces
                        let leadingSpaces = line.match(/^\s*/);
                        if (leadingSpaces) {
                            line = line.replace(/^\s*/, '');
                        }
                        return (
                            <div key={index} className={`pseudocode-line ${highlightClass}`}>
                                <span className="line-number">{index + 1}</span>
                                <span className="leading-spaces">{leadingSpaces}</span>
                                {
                                    line.split(' ').map((word, index) => {
                                        let syntaxClass = getSyntaxClass(word);
                                        return (
                                            <span key={index} className={syntaxClass}>
                                                {word}
                                                {index !== line.split(' ').length - 1 ? ' ' : ''}
                                            </span>
                                        );
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        </div>
    </div>)


    return {setSliderValue, setArrayState, setTrackerState, setMaxSliderValue, setPseudocodeState, jsx}
}