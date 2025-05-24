import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import Sidebar from './sidebar';
import { showSuccessAlert, showErrorAlert } from '../config/alertUtils';

function DriverAssignment() {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const navigate = useNavigate();

  // Obtener choferes y vehículos desde la API
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await fetch('http://3.82.92.155:3000/empleado');
        if (!response.ok) {
          throw new Error('Error al obtener los choferes');
        }
        const data = await response.json();
        setDrivers(data);
        console.log('Choferes:', data); // Verificar que se reciban correctamente los choferes
      } catch (error) {
        console.error(error);
        showErrorAlert('Error al obtener los choferes');
      }
    };

    const fetchVehicles = async () => {
      try {
        const response = await fetch('http://3.82.92.155:3000/unidades');
        if (!response.ok) {
          throw new Error('Error al obtener los vehículos');
        }
        const data = await response.json();
        setVehicles(data);
        console.log('Vehículos:', data); // Verificar que se reciban correctamente los vehículos
      } catch (error) {
        console.error(error);
        showErrorAlert('Error al obtener los vehículos');
      }
    };

    fetchDrivers();
    fetchVehicles();
  }, []);

  // Función para manejar la asignación
  const handleAssignDriver = async () => {
    if (!selectedDriverId || !selectedVehicleId) {
      showErrorAlert('Debe seleccionar un chofer y un vehículo');
      return;
    }

    console.log('Datos enviados al backend:', {
      choferId: selectedDriverId,
      unidadId: selectedVehicleId,
    });

    try {
      const response = await fetch('http://3.82.92.155:3000/chofer/asignar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          choferId: selectedDriverId,
          unidadId: selectedVehicleId,
        }),
      });

      if (response.ok) {
        showSuccessAlert('Chofer asignado correctamente');
        setSelectedDriverId('');
        setSelectedVehicleId('');
        // Redirigir a la página de lista de asignaciones
        navigate('/driver-assignment-list');
      } else {
        showErrorAlert('Error al asignar el chofer');
      }
    } catch (error) {
      console.error('Error al asignar chofer:', error);
      showErrorAlert('Ocurrió un error al asignar el chofer');
    }
  };

  // Función para desasignar un chofer
  const handleUnassignDriver = async (driverId) => {
    try {
      const response = await fetch(`http://3.82.92.155:3000/chofer/desasignar/${driverId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showSuccessAlert('Chofer desasignado correctamente');
      } else {
        showErrorAlert('Error al desasignar el chofer');
      }
    } catch (error) {
      console.error('Error al desasignar chofer:', error);
      showErrorAlert('Ocurrió un error al desasignar el chofer');
    }
  };

  return (
    <div className="home-container">
      {/* Header */}
      <Header />

      <div className="main-content">
        {/* Sidebar */}
        <Sidebar />

        <div className="assignment-container">
          <h2>Asignación de Chofer</h2>

          <div className="form-container">
            <div className="form-group">
              <label htmlFor="driver">Seleccionar Chofer</label>
              <select
                id="driver"
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
                className="form-input"
              >
                <option value="">Seleccione un chofer</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.nombre} {driver.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="vehicle">Seleccionar Vehículo</label>
              <select
                id="vehicle"
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                className="form-input"
              >
                <option value="">Seleccione un vehículo</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    Marca: {vehicle.marca.marca} - Modelo: {vehicle.modelo.modelo} - Placas: {vehicle.placas}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAssignDriver}
              className="assign-btn"
            >
              Asignar Chofer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DriverAssignment;

