import React, { useEffect, useRef } from "react";
import "./AlgorithmPlayer.css";
import { createSearchEngine } from "../Hooks/factories";
import { useLinearPlayer } from "../Hooks/useLinearPlayer";
import { Comparable } from "../Models/DataTypes";

interface SearchAlgorithmPlayerProps {
    array: Comparable[];
    compare: (a: Comparable, b: Comparable) => number;
    searchKey: Comparable;
    type: string;
    displayMode: 'bars' | 'boxes' 
}

const SearchAlgorithmPlayer: React.FC<SearchAlgorithmPlayerProps> = ({
    array,
    compare,
    searchKey,
    type,
    displayMode
}) => {
    const factory = () => createSearchEngine(type, compare);

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
        const { engine, tracker } = createSearchEngine(type, compare);

        setTrackerState(tracker);
        engine.run(array, searchKey);
        setMaxSliderValue(tracker.size - 1);
        setPseudocodeState(engine.pseudocode);
    }, [array, searchKey, type]);

    return jsx;
};

export default SearchAlgorithmPlayer;