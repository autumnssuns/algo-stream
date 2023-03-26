import { useState } from "react";

export function useSearchAlgorithmOptions() {
    let [key, setKey] = useState<any>(0);
    let [algorithm, setType] = useState<'sequential' | 'binary'>('sequential');

    let searchAlgorithmOptionsJsx = (<div>
      <div className='input-type-container'>
          <label>Algorithm</label>
          <select onChange={(e) => setType(e.target.value as any)}>
            <option value="sequential">Sequential Search</option>
            <option value="binary">Binary Search</option>
          </select>
        </div>
        <div className='input-key-container'>
          <label>Key</label>
          <input type="text" onChange={(e) => setKey(e.target.value)} />
        </div>
      </div>)

    return {key, algorithm, searchAlgorithmOptionsJsx}
}