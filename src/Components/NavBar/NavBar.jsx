import React from 'react'
import './NavBar.css'
import { Link } from 'react-router-dom' 
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
            <Link to="#">
               <img src="logo.svg" alt="" />
            </Link>
           </div>
           <div className="nav-icons-div">
            <Link to="/tasks">
              <CircleCheckBig className="nav-icon" size={40} />
            </Link>
            <Link to="/admin">
            <ShieldUser className="nav-icon" size={40} />
            </Link>
            <Link to="/inventory">
            <PackageOpen className="nav-icon" size={40} />
            </Link>
            <Link to="/accounts">
            <Calculator className="nav-icon" size={40} />
            </Link>
            <Link to="/users">
            <UserRound className="nav-icon" size={40} />
            </Link>
            
          </div>

           <div className="nav-setting-div">
           <Link to="#">
                <Settings className='setting-icon' size={60} />
          </Link>
           </div>

      </div> 
    </>
  )
}
export default NavBar;
