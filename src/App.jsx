import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Inventory from './Components/Inventory/Inventory';
import NavBar from './Components/NavBar/NavBar';


function App() {
  const [selectedPage, setSelectedPage] = useState('inventory');


  return (
    <>
      <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Inventory />} />
      </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
