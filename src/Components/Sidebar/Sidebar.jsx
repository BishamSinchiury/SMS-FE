// Components/Sidebar.jsx
import { useState } from 'react';
import './Slidebar.css';

function Sidebar({ selectedPage, setSelectedPage }) {
    return (
      <div className="sidebar">
        <button onClick={() => setSelectedPage('inventory')}>Inventory</button>
        <button onClick={() => setSelectedPage('tasks')}>Tasks</button>
        <button onClick={() => setSelectedPage('users')}>Users</button>
      </div>
    );
  }
  
  export default Sidebar;
  