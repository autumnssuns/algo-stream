import React, { useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import SearchAlgorithmPlayer from './Components/SearchAlgorithmPlayer';

function App() {
  let [array, setArray] = React.useState<any[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  let [key, setKey] = React.useState<any>(0);
  let [type, setType] = React.useState<'sequential' | 'binary'>('sequential');
  let compare = (a: any, b: any) => {
    if (a < b) {
      return -1;
    } else if (a > b) {
      return 1;
    } else {
      return 0;
    }
  }

  return (
    <div className="App">
      <div className="input-container">
        <div className='input-array-container'>
          <label>Array</label>
          <input type="text" 
            value={array.join(',')}
            onChange={(e) => setArray(prev => {
              // Should do nothing if previous array is the same as the new array
              if (prev.join(',') === e.target.value) {
                return prev;
              }
              let arr = e.target.value.split(',');
              return arr;
            })} 
          />
        </div>
        <div className='input-key-container'>
          <label>Key</label>
          <input type="text" onChange={(e) => setKey(e.target.value)} />
        </div>
        <div className='input-type-container'>
          <label>Type</label>
          <select onChange={(e) => setType(e.target.value as any)}>
            <option value="sequential">Sequential</option>
            <option value="binary">Binary</option>
          </select>
        </div>
      </div>
      <SearchAlgorithmPlayer array={array} compare={compare} searchKey={key} type={type}/>
    </div>
  );
}

export default App;
