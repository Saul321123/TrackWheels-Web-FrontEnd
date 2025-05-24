import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirección
import Swal from 'sweetalert2'; // Importa SweetAlert2
import Header from './header';
import Sidebar from './sidebar';
import { showSuccessAlert, showErrorAlert, showConfirmationAlert } from '../config/alertUtils'; // Importamos las alertas

function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const navigate = useNavigate(); // Instanciamos useNavigate para redirección

  // Obtener vehículos desde la API
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('http://3.82.92.155:3000/unidades');
        if (!response.ok) {
          throw new Error('Error al obtener los vehículos');
        }
        const data = await response.json();
        setVehicles(data); // Guardar los vehículos en el estado
        
      } catch (error) {
        console.error(error);
        showErrorAlert('Error al obtener los vehículos'); // Alerta de error si no se obtienen
      }
    };

    fetchVehicles();
  }, []);

  // Función para eliminar un vehículo
  const handleDelete = async (id) => {
    const confirmDelete = await showConfirmationAlert('¿Estás seguro de que deseas eliminar este vehículo?');
    if (confirmDelete.isConfirmed) {
      try {
        const response = await fetch(`http://3.82.92.155:3000/unidades/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          showSuccessAlert('Vehículo eliminado correctamente');
          setVehicles(prevVehicles => prevVehicles.filter(vehicle => vehicle.id !== id)); // Eliminar del estado local
        } else {
          showErrorAlert('Error al eliminar el vehículo');
        }
      } catch (error) {
        console.error('Error al eliminar vehículo:', error);
        showErrorAlert('Ocurrió un error al eliminar el vehículo');
      }
    }
  };

  // Función para redirigir a la página de editar
  const handleEdit = (id) => {
    navigate(`/unidades/${id}/edit`); // Redirige al componente de edición con el id
  };

  // Función para redirigir a la página de creación con SweetAlert2
  const handleCreateVehicle = async () => {
    const result = await Swal.fire({
      title: '¿Quieres crear un nuevo vehículo?',
      text: 'Serás redirigido a la página de creación.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      navigate('/create-vehicle');
    }
  };

  return (
    <div className="home-container">
      {/* Header */}
      <Header />

      <div className="main-content">
        {/* Sidebar */}
        <Sidebar />

        <div className="device-list-container">
          <h2>Lista de Vehículos</h2>

          {/* Botón para crear un nuevo vehículo */}
          <button
            onClick={handleCreateVehicle}
          >
            Crear Nuevo Vehículo
          </button>

          <table className={vehicles.length === 0 ? "" : ""}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Año</th>
                <th>Placas</th>
                <th>Descripción</th>
                <th>Acciones</th> {/* Nueva columna de acciones */}
              </tr>
            </thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan="7">No hay vehículos registrados</td>
                </tr>
              ) : (
                vehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>{vehicle.id}</td>
                    <td>{vehicle.marca.marca}</td>
                    <td>{vehicle.modelo.modelo}</td>
                    <td>{vehicle.ano}</td>
                    <td>{vehicle.placas}</td>
                    <td>{vehicle.descripcion}</td>
                    <td>
                      {/* Botón de editar */}
                      <button 
                        onClick={() => handleEdit(vehicle.id)} 
                        className="edit-btn"
                        aria-label={`Editar vehículo ${vehicle.id}`}
                      >
                        Editar
                      </button>
                      {/* Botón de eliminar */}
                      <button 
                        onClick={() => handleDelete(vehicle.id)} 
                        className="delete-btn"
                        aria-label={`Eliminar vehículo ${vehicle.id}`}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default VehicleList;






