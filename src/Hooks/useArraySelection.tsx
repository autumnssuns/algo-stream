import { useState } from "react";

export function useArraySelection(){
    let [array, setArray] = useState<any[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    let [displayMode, setDisplayMode] = useState<'boxes' | 'bars'>('boxes');
    let [showButtons, setShowButtons] = useState(false);
    let compare = (a: any, b: any) => {
      if (a < b) {
        return -1;
      } else if (a > b) {
        return 1;
      } else {
        return 0;
      }
    }

    let [arraySize, setArraySize] = useState(10);
    // 3 buttons to generate array
    // 1. Generate random button, and size numeric input
    // 2. Sort ascending button
    // 3. Reverse button
    const generateButtonGroups = () => (<div className='generate-button-groups'>
        <textarea
          style={{width: '300px', height: '200px'}}
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
        <div>
        <label>Size</label>
        <input 
        style={{width: '50px'}}
        type="number" 
        value={arraySize} 
        onChange={(e) => setArraySize(parseInt(e.target.value))} />
        <button onClick={() => {
          setArray(prev => {
            let arr = [];
            for (let i = 0; i < arraySize; i++) {
              arr.push(Math.floor(Math.random() * 1000));
            }
            return arr;
          });
        }}>Randomise</button>
      </div>
      <button onClick={() => {
        setArray(prev => {
          let arr = [...prev].sort((a, b) => a - b);
          return arr;
        });
      }}>Sort Ascending</button>
      <button onClick={() => {
        setArray(prev => {
          let arr = [...prev].sort((a, b) => b - a);
          return arr;
        });
      }}>Reverse</button>
    </div>)

    const selectorJsx = (<div className="array-options-container">
    <div className='array-mode-container'>
          <label>Display Mode</label>
          <select onChange={(e) => setDisplayMode(e.target.value as any)}>
            <option value="boxes">Boxes</option>
            <option value="bars">Bars</option>
          </select>
        </div>
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
          <button onClick={() => setShowButtons(prev => !prev)}>Generate</button>
          {showButtons ? generateButtonGroups() : null}
        </div>
    </div>)

    return {array, compare, displayMode, selectorJsx}
}