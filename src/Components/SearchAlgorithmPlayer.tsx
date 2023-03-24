import React, { useEffect } from "react";
import { SearchEngine, useSearchEngine as createSearchEngine } from "../Engines/SearchEngine";
import { SequentialSearchEngine, SequentialSearchSnapshot } from "../Engines/SequentialSearchEngine";
import { Tracker } from "../Models/Utils";
import ArrayVisualiser from "./ArrayVisualiser";
import "./SearchAlgorithmPlayer.css";

interface SearchAlgorithmPlayerProps {
    array: number[];
    compare: (a: number, b: number) => number;
    searchKey: number;
    type: 'sequential' | 'binary';
}

const SearchAlgorithmPlayer: React.FC<SearchAlgorithmPlayerProps> = ({
    array,
    compare,
    searchKey,
    type
}) => {
    let [sliderValue, setSliderValue] = React.useState(0);
    let [maxSliderValue, setMaxSliderValue] = React.useState(100);
    let [arrayState, setArrayState] = React.useState(array);
    let [pointerState, setPointerState] = React.useState<{ index: number; color: string }[]>([]);

    let [started, setStarted] = React.useState(false);
    // let tracker = new Tracker<SequentialSearchSnapshot<number>>();
    // let searchEngine = new SequentialSearchEngine<number>(tracker, compare);
    let { engine, tracker, cursorColorMap } = createSearchEngine(type, (a: number, b: number) => a - b);

    let [trackerState, setTrackerState] = React.useState(tracker);
    let [searchEngineState, setSearchEngineState] = React.useState<SearchEngine<number>>(engine);
    let [pseudocodeState, setPseudocodeState] = React.useState<string>("");
    useEffect(() => {
        let snapshot = trackerState.getSnapshot(sliderValue);
        if (snapshot) {
            let colors: {index: number, color: string}[] = [];
            cursorColorMap.forEach((color, index) => {
                console.log(index)
                colors.push({
                    index: snapshot[index],
                    color: color,
                });
            });
            setPointerState(colors);
            console.log(colors)
            setArrayState(snapshot.array);
        }
      }, [sliderValue]);

    useEffect(() => {
        setSliderValue(0);
        setArrayState(array);
        let { engine, tracker } = createSearchEngine(type, (a: number, b: number) => a - b);

        setTrackerState(tracker);
        setSearchEngineState(new SequentialSearchEngine<number>(tracker, compare));
        engine.search(array, searchKey);
        setMaxSliderValue(tracker.size);
        setPseudocodeState(engine.pseudocode);
    }, [array, searchKey, type]);

    return (
        <div>
            <ArrayVisualiser array={arrayState} pointers={pointerState} />
            <button onClick={(sender) => {
                if (!started) {
                    const INTERVAL = 100;
                    setStarted(true);
                    let button = sender.currentTarget;
                    button.disabled = true;
                    setSliderValue(0);
                    let interval = setInterval(() => {
                        setSliderValue(prev => prev + 1);
                    }, INTERVAL);
                    setTimeout(() => {
                        setStarted(false);
                        clearInterval(interval);
                        button.disabled = false;
                    }, INTERVAL * trackerState.size);
                }
            }}>Start</button>
            <input type="range" min="0" max={maxSliderValue} value={sliderValue} onChange={(e) => setSliderValue(e.target.valueAsNumber)} />
            <div className="labels-container">
                {
                trackerState.log.filter((log, index) => index <= sliderValue).map((log, index) => {
                    return (
                    <span key={index} className="label">
                        {log.label}
                    </span>
                    );
                })
                }
            </div>
            <div className='pseudocode-container'>
                {
                    pseudocodeState.split('\n').map((line, index) => {
                        return (
                            <span key={index} className='pseudocode-line'>
                                {line}
                            </span>
                        )
                    })
                }
            </div>
        </div>
    )
};

export default SearchAlgorithmPlayer;