import './App.css';
import { Routes, Route, Outlet } from 'react-router-dom';
import { HomePage } from './Pages/HomePage';
import { LinearAlgorithmsPage } from './Pages/LinearAlgorithmsPage';
import { GraphVisualiser } from './Components/GraphVisualiser';
import { BinarySearchTree, TraverseOrder } from './Models/DataStructures/BinarySearchTree';
import { useEffect, useState } from 'react';

function App() {
  const [treeState, setTreeState] = useState(new BinarySearchTree());

  useEffect(() => {
    treeState.insert(50, treeState.root);

    // setInterval(() => {
    //   setTreeState((prev) => {
    //     const copy = prev.copy();
    //     copy.insert(Math.floor(Math.random() * 100), copy.root);
    //     return copy;
    //   })
    // }, 1000);
    
    // // Every 2 seconds, remove a random node
    // setInterval(() => {
    //   setTreeState((prev) => {
    //     const copy = prev.copy();
    //     // Get all available nodes
    //     const nodes = copy.toArray();
    //     // Get a random node
    //     const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
    //     // Remove the random node
    //     copy.delete(randomNode, copy.root);
    //     return copy;
    //   })
    // }, 2000)
  }, [])

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='about' element={<h1>About</h1>} />
        <Route path='linear-algorithms/*' element={<LinearAlgorithmsPage/>}/>
      </Routes>
      {/* Insert a node */}
      <input type="number" id="insert" name="insert" />
      <button onClick=
        {() => {
          const input = document.getElementById('insert') as HTMLInputElement;
          const value = input.value;
          if (value) {
            setTreeState((prev) => {
              const copy = prev.copy();
              copy.insert(Number(value), copy.root);
              return copy;
            })
          }
        }}
      >Insert</button>
      <GraphVisualiser tree={treeState}/>
    </div>
  );
}

export default App;
