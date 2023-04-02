import { BrowserRouter, Link, Outlet, Route, Router, Routes } from "react-router-dom";
import { useArraySelection } from "../Hooks/useArraySelection";
import { useSearchAlgorithmOptions } from "../Hooks/useSearchAlgorithmOptions";
import { useSortAlgorithmOptions } from "../Hooks/useSortAlgorithmOptions";
import { Comparable } from "../Models/DataTypes";
import SearchAlgorithmPlayer from "../Components/SearchAlgorithmPlayer";
import SortAlgorithmPlayer from "../Components/SortAlgorithmPlayer";

export function LinearAlgorithmsPage(){
    const compare = (a: Comparable, b: Comparable) => {
        if (a < b) {
          return -1;
        } else if (a > b) {
          return 1;
        } else {
          return 0;
        }
      }
      const initialArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    
      const {array, displayMode, selectorJsx} = useArraySelection(initialArray, compare);
      const {key, algorithm: searchAlgorithm, searchAlgorithmOptionsJsx} = useSearchAlgorithmOptions();
      const {algorithm: sortAlgorithm, sortAlgorithmOptionsJsx} = useSortAlgorithmOptions();
      
      return (
        <div>
            <h1>Algorithms</h1>
            {selectorJsx}
            <div className="algorithm-type-nav-bar">
                <Link to="/linear-algorithms/search">Search</Link>
                <Link to="/linear-algorithms/sort">Sort</Link>
            </div>
            <Routes>
                <Route path='search' element={<div>
                    {searchAlgorithmOptionsJsx}
                    <SearchAlgorithmPlayer array={array} compare={compare} searchKey={key} type={searchAlgorithm} displayMode={displayMode} />
                </div>} />
                <Route path='sort' element={<div>
                    {sortAlgorithmOptionsJsx}
                    <SortAlgorithmPlayer array={array} compare={compare} type={sortAlgorithm} displayMode={displayMode} />
                </div>} />
            </Routes>
          </div>
      );
}