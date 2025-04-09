import { useState } from 'react';
import './App.css';

import ItemsSheet from './Components/Inventory/ItemsSheet/ItemsSheet';


function App() {
  const [selectedPage, setSelectedPage] = useState('inventory');


  return (
    <>
    <ItemsSheet />
    </>
  );
}

export default App;
