import { useState } from "react";

export function useSortAlgorithmOptions() {
    let [algorithm, setType] = useState<'sequential' | 'binary'>('sequential');

    let sortAlgorithmOptionsJsx = (<div>
      <div className='input-type-container'>
          <label>Algorithm</label>
          <select onChange={(e) => setType(e.target.value as any)}>
            <option value="insertion">Insertion Sort</option>
            <option value="selection">Selection Sort</option>
            <option value="bubble">Bubble Sort</option>
            <option value="merge">Merge Sort</option>
          </select>
        </div>
      </div>)

    return {algorithm, sortAlgorithmOptionsJsx}
}