import React, { useEffect, useRef } from "react";
import { SearchEngine, useSearchEngine as createSearchEngine } from "../Engines/SearchEngine";
import { SequentialSearchEngine, SequentialSearchSnapshot } from "../Engines/SequentialSearchEngine";
import { Tracker } from "../Models/Utils";
import ArrayVisualiser from "./ArrayVisualiser";
import "./SearchAlgorithmPlayer.css";
import {getSyntaxClass} from "../Models/SyntaxFormat";

interface SearchAlgorithmPlayerProps {
    array: number[];
    compare: (a: number, b: number) => number;
    searchKey: number;
    type: 'sequential' | 'binary';
    displayMode: 'boxes' | 'bars'
}

const SearchAlgorithmPlayer: React.FC<SearchAlgorithmPlayerProps> = ({
    array,
    compare,
    searchKey,
    type,
    displayMode
}) => {
    const [sliderValue, setSliderValue] = React.useState(0);
    const [maxSliderValue, setMaxSliderValue] = React.useState(100);
    const [arrayState, setArrayState] = React.useState(array);
    const [pointerState, setPointerState] = React.useState<{ index: number; color: string }[]>([]);

    // let tracker = new Tracker<SequentialSearchSnapshot<number>>();
    // let searchEngine = new SequentialSearchEngine<number>(tracker, compare);
    const { engine, tracker, cursorColorMap } = createSearchEngine(type, (a: number, b: number) => a - b);

    const [trackerState, setTrackerState] = React.useState(tracker);
    const [searchEngineState, setSearchEngineState] = React.useState<SearchEngine<number>>(engine);
    const [pseudocodeState, setPseudocodeState] = React.useState<string>("");
    const [highlightedCodeLine, setHighlightedCodeLine] = React.useState<number>(0);
    const [highlightedLabelLine, setHighlightedLabelLine] = React.useState<number>(0);
    const ref = React.useRef<HTMLDivElement>(null);
    useEffect(() => {
        const snapshot = trackerState.getSnapshot(sliderValue);
        if (snapshot) {
            const colors: {index: number, color: string}[] = [];
            cursorColorMap.forEach((color, index) => {
                colors.push({
                    index: snapshot[index],
                    color: color,
                });
            });
            setPointerState(colors);
            if (snapshot.array) setArrayState(snapshot.array);
            setHighlightedCodeLine(snapshot.algorithmLine);
            setHighlightedLabelLine(sliderValue);
            // Scroll to the bottom of ref
            if (ref.current) {
                ref.current.scrollTop = ref.current.scrollHeight;
            }
        }
      }, [sliderValue]);

    useEffect(() => {
        setSliderValue(0);
        setArrayState(array);
        const { engine, tracker } = createSearchEngine(type, (a: number, b: number) => a - b);

        setTrackerState(tracker);
        setSearchEngineState(new SequentialSearchEngine<number>(tracker, compare));
        engine.search(array, searchKey);
        setMaxSliderValue(tracker.size);
        setPseudocodeState(engine.pseudocode);
    }, [array, searchKey, type]);

    let startButton = useRef<HTMLButtonElement>(null);
    const startButtonHandle = () => {
        const INTERVAL = 0;
        const button = startButton as unknown as HTMLButtonElement;
        button.disabled = true;
        setSliderValue(0);
        console.log('starting interval')
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

    return (
        <div>
            <ArrayVisualiser 
                array={arrayState} 
                pointers={pointerState} 
                displayMode={displayMode}
            />
            <button onClick={startButtonHandle} ref={startButton}
            >Start</button>
            <input type="range" min="0" 
            max={maxSliderValue} 
            value={sliderValue} 
            onChange={(e) => setSliderValue(e.target.valueAsNumber)} 
            step="1"
            />
            <div className="explanation-container">
                <div className="labels-container"
                ref={ref}
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
        </div>
    )
};

export default SearchAlgorithmPlayer;