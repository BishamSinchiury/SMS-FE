import { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import NavBar from './Components/NavBar/NavBar';
import TaskAssignment from './Components/Tasks/Tasks';
import Admin from './Components/Admin/Admin';
import Inventory from './Components/Inventory/Inventory';
import Accounts from './Components/Accounts/Accounts';
import Users from './Components/Users/Users';
function App() {
  const [selectedPage, setSelectedPage] = useState('inventory');


  return (
    <>
      <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/" element={<Inventory />} />
        <Route path="/tasks" element={<TaskAssignment />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/users" element={<Users />} />
      </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
