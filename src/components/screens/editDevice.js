import React, { useState, useEffect } from 'react';
import Header from './header';
import Sidebar from './sidebar';
import { useParams, useNavigate } from 'react-router-dom'; 
import { showSuccessAlert, showErrorAlert } from '../config/alertUtils'; // Importamos las alertas

const EditDevice = () => {
  const [device, setDevice] = useState({
    nombre: '',
    imei: '',
    numTel: '',
    icc: '',
    numSerie: ''
  });
  const [loading, setLoading] = useState(true);

  // Usamos useParams para obtener los parámetros de la URL
  const { id } = useParams();
  const navigate = useNavigate(); // Inicializamos useNavigate

  // Cargar los datos del dispositivo desde la API cuando el componente se monta
  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const response = await fetch(`http://3.82.92.155:3000/dispositivos/${id}`);
        const data = await response.json();
        console.log (data);
        setDevice(data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar el dispositivo:', error);
        setLoading(false);
      }
    };

    fetchDevice();
  }, [id]);

  const handleChange = (e) => {
    setDevice({
      ...device,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Realizar la solicitud PATCH para editar el dispositivo
    try {
      const response = await fetch(`http://3.82.92.155:3000/dispositivos/${id}/edit`, {
        method: 'PATCH', // Usamos PATCH aquí
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(device),
      });

      if (response.ok) {
        // Usamos la alerta de éxito importada
        showSuccessAlert('Dispositivo editado exitosamente', '/device-list'); // Redirige al listado de dispositivos
      } else {
        // Usamos la alerta de error importada
        showErrorAlert('Error al editar el dispositivo');
      }
    } catch (error) {
      console.error('Error al editar el dispositivo:', error);
      showErrorAlert('Ocurrió un error, intenta nuevamente.');
    }
  };

  if (loading) {
    return <p>Cargando datos del dispositivo...</p>;
  }

  return (
    <div className="home-container">
      {/* Header */}
      <Header />

      <div className="main-content">
        {/* Sidebar */}
        <Sidebar />

        {/* Formulario para editar el dispositivo */}
        <div className="form-container">
          <h2>Editar Dispositivo</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre del Dispositivo:</label>
              <input
                type="text"
                name="nombre"
                value={device.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>IMEI del Dispositivo:</label>
              <input
                type="text"
                name="imei"
                value={device.imei}
                onChange={handleChange}
                required
                pattern="^\d{15}$"
                placeholder="Ejemplo: 864893033883870"
              />
            </div>

            <div className="form-group">
              <label>Número de Serie:</label>
              <input
                type="text"
                name="numSerie"
                value={device.numSerie}
                onChange={handleChange}
                required
                pattern="\d{15}"
                placeholder="Ejemplo: 101010101010101"
              />
            </div>

            <div className="form-group">
              <label>Número de Teléfono:</label>
              <input
                type="tel"
                name="numTel"
                value={device.numTel}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                placeholder="Ejemplo: 2481084715"
              />
            </div>

            <div className="form-group">
              <label>ICC:</label>
              <input
                type="text"
                name="icc"
                value={device.icc}
                onChange={handleChange}
                required
                pattern="^\d{19}$"
                placeholder="Ejemplo: 1234567890123456789"
              />
            </div>

            <button type="submit">Actualizar Dispositivo</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDevice;



