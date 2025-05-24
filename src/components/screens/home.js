import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import Header from './header';
import Sidebar from './sidebar';
import { io } from 'socket.io-client';
import carMarker from '../../assets/icons/carMarker.png';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Iniciar con array vacío en lugar de dispositivos estáticos
  const [devices, setDevices] = useState([]);

  // Para centrar el mapa en un dispositivo seleccionado
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  
  // Estado para controlar el InfoWindow
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  
  // Posición inicial del mapa (se actualizará cuando lleguen datos)
  const [defaultMapCenter] = useState({ lat: 18.602482, lng: -98.467619 });
  
  // Referencia al objeto del mapa
  const mapRef = useRef(null);
  
  const { isLoaded } = useLoadScript({ 
    googleMapsApiKey: "AIzaSyASyzQCCxyNZ3LfWahjeScmG3DGjJPPqzg" 
  });

  // WebSocket
  useEffect(() => {
    const socket = io('http://3.82.92.155:3003/data', {
      transports: ['websocket'], // Forzar WebSocket
    });

    socket.on('connect', () => {
      console.log('Conectado al servidor WebSocket:', socket.id);
    });

    socket.on('ultimoDato', (data) => {
      console.log("Datos recibidos del WebSocket:", data);
      
      if (Array.isArray(data)) {
        // Procesar cada dispositivo en el array
        data.forEach(deviceData => {
          processDeviceData(deviceData);
        });
      } else {
        // Si es un objeto individual, procesarlo directamente
        processDeviceData(data);
      }
    });

    // Función para procesar los datos de un dispositivo individual
    const processDeviceData = (data) => {
      const lat = parseFloat(data.latitud);
      const lng = parseFloat(data.longitud);
      const imei = data.imei; // Usar IMEI como identificador único

      if (!isNaN(lat) && !isNaN(lng)) {
        // Actualizar dispositivo existente o añadir uno nuevo
        setDevices(prevDevices => {
          // Buscar si el dispositivo ya existe
          const deviceExists = prevDevices.some(device => device.imei === imei);
          
          if (deviceExists) {
            // Actualizar dispositivo existente
            return prevDevices.map(device => 
              device.imei === imei 
                ? { 
                    ...device, 
                    position: { lat, lng }, 
                    data: data, 
                    active: true,
                    name: data.nombreDisp || `Dispositivo ${imei}`,
                    lastUpdate: new Date()
                  }
                : device
            );
          } else {
            // Añadir nuevo dispositivo
            return [...prevDevices, {
              id: imei,
              imei: imei,
              name: data.nombreDisp || `Dispositivo ${imei}`,
              phone: data.numTel || 'Sin número',
              active: true,
              position: { lat, lng },
              data: data,
              lastUpdate: new Date()
            }];
          }
        });
        
        // Autoseleccionar el primer dispositivo si no hay ninguno seleccionado
        setSelectedDeviceId(prev => prev === null ? imei : prev);
      } else {
        console.warn("Coordenadas inválidas recibidas para:", data);
      }
    };

    socket.on('disconnect', () => {
      console.log('Conexión cerrada');
    });

    socket.on('error', (error) => {
      console.error("WebSocket: Error:", error);
    });

    socket.on('close', (event) => {
      console.log("WebSocket: Conexión cerrada:", event);
    });

    // Verificar dispositivos inactivos cada 60 segundos
    const inactivityInterval = setInterval(() => {
      const now = new Date();
      setDevices(prevDevices => 
        prevDevices.map(device => {
          // Marcar como inactivo si no ha recibido actualización en 5 minutos
          if (device.lastUpdate && (now - device.lastUpdate) > 5 * 60 * 1000) {
            return { ...device, active: false };
          }
          return device;
        })
      );
    }, 60000);

    return () => {
      console.log("WebSocket: Conexión cerrada manualmente.");
      socket.close();
      clearInterval(inactivityInterval);
    };
  }, []);

  // Función para manejar cambios en la barra de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Función para manejar cambios en el filtro
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const handleLogout = () => {
    console.log("Cerrar sesión.");
  };

  const handleDeviceSelect = (deviceId) => {
    setSelectedDeviceId(deviceId);
    setShowInfoWindow(true); // Mostrar InfoWindow al seleccionar dispositivo
    
    // Encontrar el dispositivo seleccionado
    const device = devices.find(d => d.imei === deviceId);
    
    // Si se encontró el dispositivo y tenemos referencia al mapa, centrar el mapa
    if (device && mapRef.current) {
      mapRef.current.panTo(device.position);
      mapRef.current.setZoom(17); // Opcional: hacer zoom más cercano
    }
  };

  // Manejar clic en marcador del mapa
  const handleMarkerClick = (deviceId) => {
    handleDeviceSelect(deviceId);
  };

  // Cerrar InfoWindow
  const handleInfoWindowClose = () => {
    setShowInfoWindow(false);
  };

  // Filtrado de dispositivos - Aplicar ambos filtros (estado y búsqueda)
  const filteredDevices = devices.filter(device => {
    // Primero aplicar filtro por estado (activo/inactivo/todos)
    const passesStateFilter = 
      filter === 'all' || 
      (filter === 'active' && device.active) || 
      (filter === 'inactive' && !device.active);
    
    // Luego aplicar filtro por término de búsqueda
    const passesSearchFilter = searchTerm === '' || 
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.imei.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (device.data && device.data.numTel && device.data.numTel.includes(searchTerm)) ||
      (device.data && device.data.placas && device.data.placas.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // El dispositivo debe pasar ambos filtros
    return passesStateFilter && passesSearchFilter;
  });

  // Obtener el dispositivo seleccionado o el primero en la lista filtrada
  const selectedDevice = selectedDeviceId 
    ? devices.find(d => d.imei === selectedDeviceId) 
    : (filteredDevices.length > 0 ? filteredDevices[0] : null);

  // Centro del mapa basado en el dispositivo seleccionado, primer dispositivo filtrado, o centro predeterminado
  const mapCenter = selectedDevice 
    ? selectedDevice.position 
    : (filteredDevices.length > 0 ? filteredDevices[0].position : defaultMapCenter);

  const onMapLoad = (map) => {
    mapRef.current = map;
  };

  // Formatear la fecha en un formato más legible
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    return date.toLocaleString('es-MX', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit' 
    });
  };

  if (!isLoaded) return <div>Cargando mapa...</div>;

  return (
    <div className="home-container">
      {/* Header */}
      <Header onLogout={handleLogout} />

      <div className="main-content">
        {/* Sidebar */}
        <Sidebar />

        {/* Panel Izquierdo para Dispositivos */}
        <div className="left-panel">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar dispositivo, IMEI, teléfono, placas..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <div className="filters-container">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`} 
              onClick={() => handleFilterChange('all')}
            >
              Todos ({devices.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
              onClick={() => handleFilterChange('active')}
            >
              Activos ({devices.filter(d => d.active).length})
            </button>
            <button 
              className={`filter-btn ${filter === 'inactive' ? 'active' : ''}`}
              onClick={() => handleFilterChange('inactive')}
            >
              Inactivos ({devices.filter(d => !d.active).length})
            </button>
          </div>

          <div className="device-cards">
            {filteredDevices.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📡</div>
                <div className="empty-message">
                  {devices.length === 0 
                    ? "Esperando datos de dispositivos..." 
                    : "No se encontraron dispositivos con los filtros actuales"}
                </div>
              </div>
            ) : (
              filteredDevices.map(device => (
                <div 
                  key={device.imei}
                  className={`device-card ${selectedDeviceId === device.imei ? 'selected' : ''}`}
                  onClick={() => handleDeviceSelect(device.imei)}
                >
                  <div className="card-header">
                    <h3 className="device-name">{device.name}</h3>
                    <div className={`status-indicator ${device.active ? 'active' : 'inactive'}`}>
                      {device.active ? 'Activo' : 'Inactivo'}
                    </div>
                  </div>
                  
                  <div className="device-info">
                    <div className="info-row">
                      <div className="info-label">IMEI</div>
                      <div className="info-value">{device.imei}</div>
                    </div>
                    
                    <div className="info-row">
                      <div className="info-label">Teléfono</div>
                      <div className="info-value">{device.phone}</div>
                    </div>
                    
                    {device.data && (
                      <>
                        
                        {device.data.placas && (
                          <div className="info-row">
                            <div className="info-label">Placas</div>
                            <div className="info-value">{device.data.placas}</div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  {device.data && device.data.fechahra && (
                    <div className="card-footer">
                      <div className="timestamp">
                        <span className="timestamp-icon">🕒</span>
                        <span className="timestamp-text">
                          {formatDate(device.data.fechahra)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="map-container">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            zoom={15}
            center={mapCenter}
            onLoad={onMapLoad}
          >
            {/* Marcadores para cada dispositivo */}
            {filteredDevices.map(device => (
              <Marker 
                key={device.imei}
                position={device.position}
                icon={{
                  url: carMarker,
                  scaledSize: new window.google.maps.Size(45, 55),
                }}
                onClick={() => handleMarkerClick(device.imei)}
              />
            ))}

            {/* InfoWindow para mostrar detalles del dispositivo seleccionado */}
            {selectedDevice && showInfoWindow && (
              <InfoWindow
                position={selectedDevice.position}
                onCloseClick={handleInfoWindowClose}
                options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
              >
                <div className="info-window-content" style={{ padding: '10px', maxWidth: '300px' }}>
                  <div style={{ borderBottom: '1px solid #eee', marginBottom: '8px', paddingBottom: '8px' }}>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: 'bold' }}>
                      {selectedDevice.name}
                    </h3>
                    <div style={{ 
                      display: 'inline-block', 
                      padding: '2px 6px', 
                      borderRadius: '3px', 
                      fontSize: '12px',
                      backgroundColor: selectedDevice.active ? '#c8f7c5' : '#ffcccc',
                      color: selectedDevice.active ? '#0a6b06' : '#a70000'
                    }}>
                      {selectedDevice.active ? 'Activo' : 'Inactivo'}
                    </div>
                  </div>
                  
                  <div style={{ fontSize: '14px' }}>
                    <div style={{ marginBottom: '5px' }}>
                      <strong>IMEI:</strong> {selectedDevice.imei}
                    </div>
                    
                    <div style={{ marginBottom: '5px' }}>
                      <strong>Teléfono:</strong> {selectedDevice.phone}
                    </div>
                    
                    {selectedDevice.data && (
                      <>
                        {selectedDevice.data.placas && (
                          <div style={{ marginBottom: '5px' }}>
                            <strong>Placas:</strong> {selectedDevice.data.placas}
                          </div>
                        )}
                        
                        {selectedDevice.data.velocidad && (
                          <div style={{ marginBottom: '5px' }}>
                            <strong>Velocidad:</strong> {selectedDevice.data.velocidad} km/h
                          </div>
                        )}
                        
                        {selectedDevice.data.fechahra && (
                          <div style={{ marginBottom: '5px' }}>
                            <strong>Último reporte:</strong> {formatDate(selectedDevice.data.fechahra)}
                          </div>
                        )}
                        
                        <div style={{ marginBottom: '5px' }}>
                          <strong>Coordenadas:</strong> {selectedDevice.position.lat.toFixed(6)}, {selectedDevice.position.lng.toFixed(6)}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
}

export default Home;