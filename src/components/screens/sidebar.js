// src/components/Sidebar.js
import React, { useState } from 'react';
import '../../App/css/App.css';
import { Link } from 'react-router-dom';
import adminIcon from '../../assets/img/sidebar/cog-regular-24.png';
import menuIcon from '../../assets/img/sidebar/menu-regular-24.png';
import deviceIcon from '../../assets/img/sidebar/deviceIcon.png';
import employeeIcon from '../../assets/img/sidebar/employeeIcon.png';
import vehicleIcon from '../../assets/img/sidebar/vehicleIcon.png';
import homeIcon from '../../assets/img/sidebar/gpsIcon.png'

function Sidebar() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
      <button className="toggle-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>
        <img 
          src={menuIcon} 
          alt={isSidebarOpen ? 'Cerrar Sidebar' : 'Abrir Sidebar'}
        />
      </button>
      <ul>
        <li><Link to="/"><img src={homeIcon} alt="Home"/></Link></li>
        <li><Link to="/device-list"><img src={deviceIcon} alt="Listado de dispositivos"/></Link></li>
        <li><Link to="/vehicle-list"><img src={vehicleIcon} alt="Listado de dispositivos"/></Link></li>
        <li><Link to="/employee-list"><img src={employeeIcon} alt="Listado de dispositivos"/></Link></li>
        
        <li><Link to="/driver-assignment-list"><img src={vehicleIcon} alt="Listado de dispositivos"/></Link></li>
        <li><Link to="/device-assignment-list"><img src={deviceIcon} alt="Listado de dispositivos"/></Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;

