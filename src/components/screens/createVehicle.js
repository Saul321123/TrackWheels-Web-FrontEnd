import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';  // Importamos useNavigate
import Header from './header';
import Sidebar from './sidebar';
import { showSuccessAlert, showErrorAlert } from '../config/alertUtils'; // Importamos las alertas

const CreateVehicle = () => {
  const [serialNumber, setSerialNumber] = useState('');
  const [brandId, setBrandId] = useState('');
  const [modelId, setModelId] = useState('');
  const [colorId, setColorId] = useState('');
  const [year, setYear] = useState('');
  const [plates, setPlates] = useState('');
  const [typeId, setTypeId] = useState('');
  const [statusId, setStatusId] = useState('');
  const [description, setDescription] = useState('');

  // Estados para los catálogos
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);
  const [colors, setColors] = useState([]);

  // Obtención de la función de navegación
  const navigate = useNavigate();

  // Fetch de los catálogos
  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [brandsRes, modelsRes, statusesRes, typesRes, colorsRes] = await Promise.all([
          fetch('http://3.82.92.155:3000/marcas'),
          fetch('http://3.82.92.155:3000/modelos'),
          fetch('http://3.82.92.155:3000/status'),
          fetch('http://3.82.92.155:3000/tipos'),
          fetch('http://3.82.92.155:3000/color'),
        ]);

        setBrands(await brandsRes.json());
        setModels(await modelsRes.json());
        setStatuses(await statusesRes.json());
        setTypes(await typesRes.json());
        setColors(await colorsRes.json());
      } catch (error) {
        showErrorAlert('Error al cargar los catálogos: ' + error.message);
      }
    };

    fetchCatalogs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const vehicleData = {
      numSerie: serialNumber,
      marcaId: brandId,
      modeloId: modelId,
      colorId: colorId,
      ano: year,
      placas: plates,
      tipoId: typeId,
      estatusId: statusId,
      descripcion: description,
    };

    try {
      const response = await fetch('http://3.82.92.155:3000/unidades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData),
      });

      if (response.ok) {
        showSuccessAlert('Vehículo creado exitosamente');
        navigate('/vehicle-list'); // Redirige a la lista de vehículos
      } else {
        showErrorAlert('Hubo un error al crear el vehículo');
      }
    } catch (error) {
      showErrorAlert('Error de conexión: ' + error.message);
    }
  };

  return (
    <div className="vehicle-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="vehicle-form-container">
          <h2>Crear Vehículo</h2>
          <form onSubmit={handleSubmit}>
            <div className="vehicle-form-grid">
              <div className="vehicle-form-group">
                <label>Número de Serie:</label>
                <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  required
                />
              </div>
              <div className="vehicle-form-group">
                <label>Marca:</label>
                <select value={brandId} onChange={(e) => setBrandId(e.target.value)} required>
                  <option value="">Seleccione una marca</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.marca}
                    </option>
                  ))}
                </select>
              </div>
              <div className="vehicle-form-group">
                <label>Modelo:</label>
                <select value={modelId} onChange={(e) => setModelId(e.target.value)} required>
                  <option value="">Seleccione un modelo</option>
                  {models.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.modelo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="vehicle-form-group">
                <label>Color:</label>
                <select value={colorId} onChange={(e) => setColorId(e.target.value)} required>
                  <option value="">Seleccione un color</option>
                  {colors.map((color) => (
                    <option key={color.id} value={color.id}>
                      {color.color}
                    </option>
                  ))}
                </select>
              </div>
              <div className="vehicle-form-group">
                <label>Año:</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="Ejemplo: 2022"
                />
              </div>
              <div className="vehicle-form-group">
                <label>Placas:</label>
                <input
                  type="text"
                  value={plates}
                  onChange={(e) => setPlates(e.target.value)}
                  required
                />
              </div>
              <div className="vehicle-form-group">
                <label>Tipo:</label>
                <select value={typeId} onChange={(e) => setTypeId(e.target.value)} required>
                  <option value="">Seleccione un tipo</option>
                  {types.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.tipo}
                    </option>
                  ))}
                </select>
              </div>
              <div className="vehicle-form-group">
                <label>Estatus:</label>
                <select value={statusId} onChange={(e) => setStatusId(e.target.value)} required>
                  <option value="">Seleccione un estatus</option>
                  {statuses.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.estatus}
                    </option>
                  ))}
                </select>
              </div>
              <div className="vehicle-form-group">
                <label>Descripción:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  placeholder="Descripción del vehículo"
                />
              </div>
            </div>
            <button type="submit" className="vehicle-submit-button">Crear</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateVehicle;




