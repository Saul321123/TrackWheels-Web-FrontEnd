// src/pages/CreateDevice.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import Header from './header';
import Sidebar from './sidebar';
import { showSuccessAlert, showErrorAlert } from '../config/alertUtils'; // Importamos las alertas

const handleLogout = () => {
  // Lógica para cerrar sesión
};

const CreateDevice = () => {
  const [nombre, setNombre] = useState('');
  const [imei, setImei] = useState('');
  const [numTel, setNumTel] = useState('');
  const [icc, setIcc] = useState('');
  const [numSerie, setNumSerie] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate(); // Definir la función de navegación

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si todos los campos están llenos
    if (!nombre || !imei || !numTel || !icc || !numSerie) {
      setError('Por favor, complete todos los campos.');
      showErrorAlert('Por favor, complete todos los campos.');  // Alerta de error
      return;
    }

    // Generar un ID único (si el servidor lo requiere)
    const newDevice = {
      nombre,
      imei,
      numTel,
      icc,
      numSerie,
    };

    try {
      const response = await fetch('http://3.82.92.155:3000/dispositivos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDevice),
      });

      if (!response.ok) {
        throw new Error(`Error al crear el dispositivo: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.error) {
        setError(data.error);
        setSuccess('');
        showErrorAlert(data.error); // Alerta de error
      } else {
        setSuccess('Dispositivo creado exitosamente!');
        setError('');
        showSuccessAlert('Dispositivo creado exitosamente!');  // Alerta de éxito
        // Limpiar los campos del formulario
        setNombre('');
        setImei('');
        setNumTel('');
        setIcc('');
        setNumSerie('');
        
        // Redirigir a la lista de dispositivos
        navigate('/device-list'); // Ruta a la que redirigir después de crear el dispositivo
      }
    } catch (error) {
      setError(`Hubo un problema al crear el dispositivo. ${error.message}`);
      setSuccess('');
      showErrorAlert(`Hubo un problema al crear el dispositivo. ${error.message}`); // Alerta de error
    }
  };

  return (
    <div className="home-container">
      <Header onLogout={handleLogout} />
      <div className="main-content">
        <Sidebar />
        <div className="form-container">
          <h2>Crear Dispositivo</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre del Dispositivo:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>IMEI del Dispositivo:</label>
              <input
                type="text"
                value={imei}
                onChange={(e) => setImei(e.target.value)}
                required
                pattern="^\d{15}$"
                placeholder="Ejemplo: 864893033883870"
              />
            </div>
            <div className="form-group">
              <label>Número de Teléfono:</label>
              <input
                type="tel"
                value={numTel}
                onChange={(e) => setNumTel(e.target.value)}
                required
                pattern="[0-9]{10}"
                placeholder="Ejemplo: 2481084715"
              />
            </div>
            <div className="form-group">
              <label>ICC:</label>
              <input
                type="text"
                value={icc}
                onChange={(e) => setIcc(e.target.value)}
                required
                pattern="^\d{19}$"
                placeholder="19 Dígitos"
              />
            </div>
            <div className="form-group">
              <label>Número de Serie:</label>
              <input
                type="text"
                value={numSerie}
                onChange={(e) => setNumSerie(e.target.value)}
                required
                pattern="\d{8}"
                placeholder="8 dígitos"
              />
            </div>
            <button type="submit">Crear</button>
          </form>

          {/* Mensajes de error y éxito */}
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
        </div>
      </div>
    </div>
  );
};

export default CreateDevice;




