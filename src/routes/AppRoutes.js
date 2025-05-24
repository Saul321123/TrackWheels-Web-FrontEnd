import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Home from '../components/screens/home';
import CreateDevice from '../components/screens/createDevice';
import CreateVehicle from '../components/screens/createVehicle';
import DeviceList from '../components/screens/deviceList';
import EditDevice from '../components/screens/editDevice';
import EmployeeList from '../components/screens/employeeList';
import CreateEmployee from '../components/screens/createEmployee';
import EditEmployee from '../components/screens/editEmployee';
import VehicleList from '../components/screens/vehicleList';
import EditVehicle from '../components/screens/editVehicle';
import DeviceAssignment from '../components/screens/deviceAssignment';
import DriverAssignment from '../components/screens/driverAssignment';
import DriverAssignmentList from '../components/screens/driverAssignmentList';
import DeviceAssignmentList from '../components/screens/deviceAssignmentList';
import Login from '../components/screens/login';

const AppRoutes = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('userToken');
      setAuthenticated(!!token);
      setIsLoading(false);
    };
    
    checkAuth();
    
    // Agregamos un event listener para detectar cambios en localStorage
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [location]);

  const onLogout = () => {
    localStorage.removeItem('userToken');
    setAuthenticated(false);
    window.location.href = '/login';
  };

  if (isLoading) {
    return <div>Cargando...</div>; // Muestra un loader mientras verifica autenticación
  }

  return (
    <Routes>
      <Route path="/login" element={authenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={authenticated ? <Home onLogout={onLogout} /> : <Navigate to="/login" />} />
      <Route path="/create-vehicle" element={authenticated ? <CreateVehicle /> : <Navigate to="/login" />} />
      <Route path="/create-device" element={authenticated ? <CreateDevice /> : <Navigate to="/login" />} />
      <Route path="/device-list" element={authenticated ? <DeviceList /> : <Navigate to="/login" />} />
      <Route path="/employee-list" element={authenticated ? <EmployeeList /> : <Navigate to="/login" />} />
      <Route path="/vehicle-list" element={authenticated ? <VehicleList /> : <Navigate to="/login" />} />
      <Route path="/dispositivo/:id/edit" element={authenticated ? <EditDevice /> : <Navigate to="/login" />} />
      <Route path="/empleado/:id/edit" element={authenticated ? <EditEmployee /> : <Navigate to="/login" />} />
      <Route path="/unidades/:id/edit" element={authenticated ? <EditVehicle /> : <Navigate to="/login" />} />
      <Route path="/device-assignment" element={authenticated ? <DeviceAssignment /> : <Navigate to="/login" />} />
      <Route path="/driver-assignment" element={authenticated ? <DriverAssignment /> : <Navigate to="/login" />} />
      <Route path="/driver-assignment-list" element={authenticated ? <DriverAssignmentList /> : <Navigate to="/login" />} />
      <Route path="/device-assignment-list" element={authenticated ? <DeviceAssignmentList /> : <Navigate to="/login" />} />
      <Route path="/create-employee" element={authenticated ? <CreateEmployee /> : <Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;




