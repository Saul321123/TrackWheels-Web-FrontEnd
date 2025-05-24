import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Para obtener el ID y redireccionar
import Header from './header';
import Sidebar from './sidebar';
import { showSuccessAlert, showErrorAlert } from '../config/alertUtils'; // Importar alertas personalizadas

function EditVehicle() {
  const { id } = useParams(); // ID del vehículo desde la URL
  const navigate = useNavigate(); // Redirigir después de actualizar

  // Estados para los datos del vehículo
  const [vehicle, setVehicle] = useState({
    numSerie: '',
    marcaId: '',
    modeloId: '',
    colorId: '',
    ano: '',
    placas: '',
    tipoId: '',
    estatusId: '',
    descripcion: '',
  });

  // Estados para catálogos
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [types, setTypes] = useState([]);
  const [colors, setColors] = useState([]);

  const [loading, setLoading] = useState(true);

  // Obtener catálogos y datos del vehículo
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Petición paralela a los catálogos y los datos del vehículo
        const [brandsRes, modelsRes, statusesRes, typesRes, colorsRes, vehicleRes] = await Promise.all([
          fetch('http://3.82.92.155:3000/marcas'),
          fetch('http://3.82.92.155:3000/modelos'),
          fetch('http://3.82.92.155:3000/status'),
          fetch('http://3.82.92.155:3000/tipos'),
          fetch('http://3.82.92.155:3000/color'),
          fetch(`http://3.82.92.155:3000/unidades/${id}`),
        ]);

        // Establecer los datos de los catálogos
        setBrands(await brandsRes.json());
        setModels(await modelsRes.json());
        setStatuses(await statusesRes.json());
        setTypes(await typesRes.json());
        setColors(await colorsRes.json());

        // Establecer los datos del vehículo
        if (vehicleRes.ok) {
          const vehicleData = await vehicleRes.json();
          setVehicle(vehicleData[0]); // Asegurarse de establecer los datos correctamente
          console.log(vehicleData);
        } else {
          throw new Error('Error al obtener los datos del vehículo');
        }
      } catch (error) {
        console.error(error);
        showErrorAlert('Error al cargar los datos: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicle((prevVehicle) => ({
      ...prevVehicle,
      [name]: value,
    }));
  };

  // Envío del formulario para actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extraemos solo los valores necesarios de los objetos anidados
    const vehicleDataToSend = {
      numSerie: vehicle.numSerie,
      marcaId: vehicle.marcaId,
      modeloId: vehicle.modeloId,
      colorId: vehicle.colorId,
      ano: vehicle.ano,
      placas: vehicle.placas,
      tipoId: vehicle.tipoId,
      estatusId: vehicle.estatusId,
      descripcion: vehicle.descripcion,
    };

    try {
      const response = await fetch(`http://3.82.92.155:3000/unidades/${id}/edit`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleDataToSend),  // Enviar los datos con la estructura correcta
      });

      if (response.ok) {
        showSuccessAlert('Vehículo actualizado correctamente');
        navigate('/vehicle-list'); // Redirige al listado de vehículos
      } else {
        showErrorAlert('Error al actualizar el vehículo');
      }
    } catch (error) {
      console.error('Error al actualizar el vehículo:', error);
      showErrorAlert('Ocurrió un error, intenta nuevamente.');
    }
  };

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div className="vehicle-container">
      {/* Header */}
      <Header />

      <div className="main-content">
        {/* Sidebar */}
        <Sidebar />

        {/* Formulario Editar Vehículo */}
        <div className="vehicle-form-container">
          <h2>Editar Vehículo</h2>
          <form onSubmit={handleSubmit}>
            <div className="vehicle-form-grid">
              <div className="vehicle-form-group">
                <label>Número de Serie:</label>
                <input
                  type="text"
                  name="numSerie"
                  value={vehicle.numSerie}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="vehicle-form-group">
                <label>Marca:</label>
                <select
                  name="marcaId"
                  value={vehicle.marcaId}
                  onChange={handleChange}
                  required
                >
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
                <select
                  name="modeloId"
                  value={vehicle.modeloId}
                  onChange={handleChange}
                  required
                >
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
                <select
                  name="colorId"
                  value={vehicle.colorId}
                  onChange={handleChange}
                  required
                >
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
                  name="ano"
                  value={vehicle.ano}
                  onChange={handleChange}
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
                  name="placas"
                  value={vehicle.placas}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="vehicle-form-group">
                <label>Tipo:</label>
                <select
                  name="tipoId"
                  value={vehicle.tipoId}
                  onChange={handleChange}
                  required
                >
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
                <select
                  name="estatusId"
                  value={vehicle.estatusId}
                  onChange={handleChange}
                  required
                >
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
                  name="descripcion"
                  value={vehicle.descripcion}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button type="submit">Actualizar Vehículo</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditVehicle;









