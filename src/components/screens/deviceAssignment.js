import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header';
import Sidebar from './sidebar';
import { showSuccessAlert, showErrorAlert } from '../config/alertUtils';

function DeviceAssignment() {
  const [devices, setDevices] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const navigate = useNavigate();

  // Obtener dispositivos desde la API
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('http://3.82.92.155:3000/dispositivos');
        if (!response.ok) {
          throw new Error('Error al obtener los dispositivos');
        }
        const data = await response.json();
        setDevices(data);
        console.log('Dispositivos:', data);  // Verificar que se reciban correctamente los dispositivos
      } catch (error) {
        console.error(error);
        showErrorAlert('Error al obtener los dispositivos');
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
        console.log('Vehículos:', data);  // Verificar que se reciban correctamente los vehículos
      } catch (error) {
        console.error(error);
        showErrorAlert('Error al obtener los vehículos');
      }
    };

    fetchDevices();
    fetchVehicles();
  }, []);

  // Función para manejar la asignación
  const handleAssignDevice = async () => {
    if (!selectedDeviceId || !selectedVehicleId) {
      showErrorAlert('Debe seleccionar un dispositivo y un vehículo');
      return;
    }

    // Log para mostrar los datos que se enviarán al backend
    console.log('Datos enviados al backend:', {
      dispositivoId: selectedDeviceId,
      unidadId: selectedVehicleId,
    });

    try {
      const response = await fetch('http://3.82.92.155:3000/asignaciones/dispositivo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dispositivoId: selectedDeviceId,
          unidadId: selectedVehicleId,
        }),
      });

      if (response.ok) {
        showSuccessAlert('Dispositivo asignado correctamente');
        setSelectedDeviceId('');
        setSelectedVehicleId('');
        navigate('/device-assignment-list'); // Redirigir a /device-assignment-list después de la asignación
      } else {
        showErrorAlert('Error al asignar el dispositivo');
      }
    } catch (error) {
      console.error('Error al asignar dispositivo:', error);
      showErrorAlert('Ocurrió un error al asignar el dispositivo');
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
          <h2>Asignación de Dispositivo</h2>

          <div className="form-container">
            <div className="form-group">
              <label htmlFor="device">Seleccionar Dispositivo</label>
              <select
                id="device"
                value={selectedDeviceId}
                onChange={(e) => setSelectedDeviceId(e.target.value)}
                className="form-input"
              >
                <option value="">Seleccione un dispositivo</option>
                {devices.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.nombre}
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
              onClick={handleAssignDevice}
              className="assign-btn"
            >
              Asignar Dispositivo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeviceAssignment;






