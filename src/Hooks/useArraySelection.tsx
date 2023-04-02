import { useState } from "react";
import { Comparable } from "../Models/DataTypes";

export function useArraySelection(initial: Comparable[], compare: (a: Comparable, b: Comparable) => number){
    let [array, setArray] = useState<Comparable[]>(initial);
    let [displayMode, setDisplayMode] = useState<'boxes' | 'bars'>('bars');
    let [showButtons, setShowButtons] = useState(false);
    // let compare = (a: T, b: T) => {
    //   if (a < b) {
    //     return -1;
    //   } else if (a > b) {
    //     return 1;
    //   } else {
    //     return 0;
    //   }
    // }

    const arrayInboxChangeHandler = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
      setArray(prev => {
        // Should do nothing if previous array is the same as the new array
        if (prev.map((item) => item.toString().trim()).join(',') === e.target.value) {
          return prev;
        }
        let arr = e.target.value.split(',').map((item) => item.trim()).map((item) => {
          // Check if item is a number
          if (item.match(/^-?\d+\.?\d*$/)) {
            return parseFloat(item);
          } else {
            return item;
          }
        });
        return arr;
      });
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
          onChange={arrayInboxChangeHandler} 
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
              arr.push(Math.floor(Math.random() * arraySize * 2));
            }
            return arr;
          });
        }}>Randomise</button>
      </div>
      <button onClick={() => {
        setArray(prev => {
          let arr = [...prev].sort((a, b) => compare(a, b));
          return arr;
        });
      }}>Sort Ascending</button>
      <button onClick={() => {
        setArray(prev => {
          let arr = [...prev].reverse();
          return arr;
        });
      }}>Reverse</button>
    </div>)

    const selectorJsx = (<div className="array-options-container">
    <div className='array-mode-container'>
          <label>Display Mode</label>
          <select onChange={(e) => setDisplayMode(e.target.value as 'boxes' | 'bars')}>
            <option value="bars">Bars</option>
            <option value="boxes">Boxes</option>
          </select>
        </div>
        <div className='input-array-container'>
          <label>Array</label>
          <input type="text" 
            value={array.join(',')}
            onChange={arrayInboxChangeHandler} 
          />
          <button onClick={() => setShowButtons(prev => !prev)}>Generate</button>
          {showButtons ? generateButtonGroups() : null}
        </div>
    </div>)

    return {array, displayMode, selectorJsx}
}