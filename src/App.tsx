import './App.css';
import SearchAlgorithmPlayer from './Components/SearchAlgorithmPlayer';
import { useArraySelection } from './Hooks/useArraySelection';
import {useSearchAlgorithmOptions} from './Hooks/useSearchAlgorithmOptions';
import { Routes, Route, Outlet } from 'react-router-dom';
import { AlgorithmTypeNavBar } from './Components/AlgorithmTypeNavBar';
import { useSortAlgorithmOptions } from './Hooks/useSortAlgorithmOptions';
import SortAlgorithmPlayer from './Components/SortAlgorithmPlayer';
import { HomePage } from './Pages/HomePage';

function App() {
  const {array, compare, displayMode, selectorJsx} = useArraySelection();
  const {key, algorithm: searchAlgorithm, searchAlgorithmOptionsJsx} = useSearchAlgorithmOptions();
  const {algorithm: sortAlgorithm, sortAlgorithmOptionsJsx} = useSortAlgorithmOptions();

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<HomePage/>}>
        </Route>
        <Route path='about' element={<h1>About</h1>} />
        <Route path='algorithms' element={<div>
            <h1>Algorithms</h1>
            {selectorJsx}
            <AlgorithmTypeNavBar/>
            <Outlet/>
          </div>
          }>
          <Route path='search' element={<div>
            {searchAlgorithmOptionsJsx}
            <SearchAlgorithmPlayer array={array} compare={compare} searchKey={key} type={searchAlgorithm} displayMode={displayMode} />
          </div>} />
          <Route path='sort' element={<div>
            {sortAlgorithmOptionsJsx}
            <SortAlgorithmPlayer array={array} compare={compare} type={sortAlgorithm} displayMode={displayMode} />
          </div>
        } />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
