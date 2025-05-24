import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate para redirección
import Swal from 'sweetalert2'; // Importa SweetAlert2
import Header from './header';
import Sidebar from './sidebar';
import { showSuccessAlert, showErrorAlert, showConfirmationAlert } from '../config/alertUtils'; // Importamos las alertas


function DeviceList() {
  const [devices, setDevices] = useState([]);
  const navigate = useNavigate(); // Instanciamos useNavigate para redirección

  // Obtener dispositivos desde la API
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await fetch('http://3.82.92.155:3000/dispositivos');
        if (!response.ok) {
          throw new Error('Error al obtener los dispositivos');
        }
        const data = await response.json();
        setDevices(data); // Guardar los dispositivos en el estado
      } catch (error) {
        console.error(error);
        showErrorAlert('Error al obtener los dispositivos'); // Alerta de error si no se obtienen
      }
    };

    fetchDevices();
  }, []);

  // Función para eliminar un dispositivo
  const handleDelete = async (id) => {
    const confirmDelete = await showConfirmationAlert('¿Estás seguro de que deseas eliminar este dispositivo?');
    if (confirmDelete.isConfirmed) {
      try {
        const response = await fetch(`http://3.82.92.155:3000/dispositivos/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          showSuccessAlert('Dispositivo eliminado correctamente');
          setDevices(prevDevices => prevDevices.filter(device => device.id !== id)); // Eliminar del estado local
        } else {
          showErrorAlert('Error al eliminar el dispositivo');
        }
      } catch (error) {
        console.error('Error al eliminar dispositivo:', error);
        showErrorAlert('Ocurrió un error al eliminar el dispositivo');
      }
    }
  };

  // Función para redirigir a la página de editar
  const handleEdit = (id) => {
    navigate(`/dispositivo/${id}/edit`); // Redirige al componente de edición con el id
  };

  // Función para redirigir a la página de creación con SweetAlert2
  const handleCreateDevice = async () => {
    const result = await Swal.fire({
      title: '¿Quieres crear un nuevo dispositivo?',
      text: 'Serás redirigido a la página de creación.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'bg-green-500 text-white hover:bg-green-600 px-4 py-2 rounded',
        cancelButton: 'bg-gray-300 text-black hover:bg-gray-400 px-4 py-2 rounded',
      },
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      navigate('/create-device');
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
          <h2 className="text-2xl font-semibold mb-4">Lista de Dispositivos</h2>

          {/* Botón para crear un nuevo dispositivo */}
          <button
            className='add-btn'
            onClick={handleCreateDevice}
          >
            Crear Nuevo Dispositivo
          </button>

          <table className={devices.length === 0 ? "empty-table" : "table-auto w-full text-left"}>
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>IMEI</th>
                <th>Teléfono</th>
                <th>ICC</th>
                <th>Número de Serie</th>
                <th>Acciones</th> {/* Nueva columna de acciones */}
              </tr>
            </thead>
            <tbody>
              {devices.length === 0 ? (
                <tr>
                  <td colSpan="7">No hay dispositivos registrados</td>
                </tr>
              ) : (
                devices.map((device) => (
                  <tr key={device.id} className="border-b">
                    <td>{device.id}</td>
                    <td>{device.nombre}</td>
                    <td>{device.imei}</td>
                    <td>{device.numTel}</td>
                    <td>{device.icc}</td>
                    <td>{device.numSerie}</td>
                    <td className=" flex space-x-2">
                      {/* Botón de editar */}
                      <button
                        onClick={() => handleEdit(device.id)}
                        className="edit-btn"
                        aria-label={`Editar dispositivo ${device.id}`}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(device.id)}
                        className="delete-btn"
                        aria-label={`Eliminar dispositivo ${device.id}`}
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

export default DeviceList;







