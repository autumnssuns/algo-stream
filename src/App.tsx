import './App.css';
import { Routes, Route, Outlet } from 'react-router-dom';
import { HomePage } from './Pages/HomePage';
import { LinearAlgorithmsPage } from './Pages/LinearAlgorithmsPage';
import { GraphVisualiser } from './Components/GraphVisualiser';
import { BinarySearchTree, TraverseOrder } from './Models/DataStructures/BinarySearchTree';
import { useEffect, useState } from 'react';
import { BinarySearchTreePage } from './Pages/BinarySearchTreePage';
import { createBinarySearchTreeEngine } from './Hooks/factories';

function App() {
  const { engine, tracker, cursorColorMap } = createBinarySearchTreeEngine("insertion");
  const tree = new BinarySearchTree();

  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='about' element={<h1>About</h1>} />
        <Route path='linear-algorithms/*' element={<LinearAlgorithmsPage/>}/>
        <Route path='binary-search-tree/*' element={<BinarySearchTreePage
          engine={engine}
          tracker={tracker}
          cursorColorMap={cursorColorMap}
        />}/>
      </Routes>
    </div>
  );
}

export default App;
