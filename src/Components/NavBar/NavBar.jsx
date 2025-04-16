import React from 'react'
import './NavBar.css'
import { UserRound } from 'lucide-react';
import { Calculator } from 'lucide-react';
import { PackageOpen } from 'lucide-react';
import { CircleCheckBig } from 'lucide-react';
import { Settings } from 'lucide-react';
import { ShieldUser } from 'lucide-react';
function NavBar(){
  return (
    <>
      <div className="nav-main-div">

           <div className="nav-logo-div">
               <img src="logo.svg" alt="" />
           </div>

           <div className="nav-icons-div">
            <CircleCheckBig className="nav-icon" size={40} />
            <ShieldUser className="nav-icon" size={40} />
            <PackageOpen className="nav-icon" size={40} />
            <Calculator className="nav-icon" size={40} />
            <UserRound className="nav-icon" size={40} />
          </div>

           <div className="nav-setting-div">
                <Settings className='setting-icon' size={60} />
           </div>

      </div> 
    </>
  )
}
export default NavBar;
