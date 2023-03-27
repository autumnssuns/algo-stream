import React, { useEffect, useRef } from "react";
import "./AlgorithmPlayer.css";
import { createSortEngine } from "../Hooks/factories";
import { useLinearPlayer } from "../Hooks/useLinearPlayer";

interface SearchAlgorithmPlayerProps {
    array: number[];
    compare: (a: number, b: number) => number;
    type: string;
    displayMode: 'bars' | 'boxes' 
}

const SearchAlgorithmPlayer: React.FC<SearchAlgorithmPlayerProps> = ({
    array,
    compare,
    type,
    displayMode
}) => {
    const factory = () => createSortEngine(type, compare);

    const {setSliderValue, 
        setArrayState, 
        setTrackerState, 
        setMaxSliderValue, 
        setPseudocodeState,
        jsx} = useLinearPlayer(array, displayMode, factory)

    // Update the search engine when the array or search key changes
    useEffect(() => {
        setSliderValue(0);
        setArrayState(array);
        const { engine, tracker } = createSortEngine(type, compare);

        setTrackerState(tracker);
        engine.run([...array]);
        setMaxSliderValue(tracker.size - 1);
        setPseudocodeState(engine.pseudocode);
    }, [array, type]);

    return jsx;
};

export default SearchAlgorithmPlayer;