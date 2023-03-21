import React from 'react';
import logo from './logo.svg';
import './App.css';
import ArrayVisualiser from './Components/ArrayVisualiser';
import { Tracker } from './Models/Utils';
import { SequentialSearchEngine, SequentialSearchSnapshot } from './Engines/SequentialSearchEngine';
import { ComparableNumber } from './Models/DataTypes';

function App() {
  let [sliderValue, setSliderValue] = React.useState(0);
  let [maxSliderValue, setMaxSliderValue] = React.useState(100);

  let tracker = new Tracker<SequentialSearchSnapshot<ComparableNumber>>();
  let searchEngine = new SequentialSearchEngine<ComparableNumber>(tracker);

  let myArray: ComparableNumber[] = [];
  for (let i = 0; i < 10; i++) {
    myArray.push(new ComparableNumber(i));
  }

  let [arrayState, setArrayState] = React.useState(myArray);
  let [pointerState, setPointerState] = React.useState<{ index: number; color: string }[]>([]);

  React.useEffect(() => {
    let snapshot = tracker.getSnapshot(sliderValue);
    if (snapshot) {
      setArrayState(snapshot.array);
      setPointerState([{
        index: snapshot.index,
        color: 'red',
      }]);
    }
  }, [sliderValue]);

  React.useEffect(() => {
    setMaxSliderValue(tracker.size - 1);
  }, [tracker.isComplete]);

  searchEngine.search(myArray, new ComparableNumber(11));

  return (
    <div className="App">
      <ArrayVisualiser array={arrayState} pointers={pointerState} />
      <input type="range" min="0" max={maxSliderValue} value={sliderValue} onChange={(e) => setSliderValue(e.target.valueAsNumber)} />
      <div className="labels-container">
        {
          tracker.log.filter((log, index) => index <= sliderValue).map((log, index) => {
            return (
              <p key={index} className="label">
                {log.label}
              </p>
            );
          })
        }
      </div>
      <div className='pseudocode-container'>
        {
          searchEngine.psedocode.split('\n').map((line, index) => {
            return (
              <p key={index} className="pseudocode-line">
                {line}
              </p>
            );
          })
        }
      </div>
    </div>
  );
}

export default App;
