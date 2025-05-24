import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from './header';
import Sidebar from './sidebar';
import { showSuccessAlert, showErrorAlert } from '../config/alertUtils';

function DeviceAssignmentList() {
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  // Obtener asignaciones de dispositivos desde la API
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('http://3.82.92.155:3000/asignaciones/listado');
        if (!response.ok) {
          throw new Error('Error al obtener las asignaciones');
        }
        const data = await response.json();
        setAssignments(data);  // Asignar directamente los datos si son un array
      } catch (error) {
        console.error(error);
        showErrorAlert('Error al obtener las asignaciones');
      }
    };

    fetchAssignments();
  }, []);

  // Función para redirigir a la página de asignación de dispositivo
  const handleCreateAssignment = async () => {
    const result = await Swal.fire({
      title: '¿Quieres agregar una nueva asignación?',
      text: 'Serás redirigido a la página de creación.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, agregar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      navigate('/device-assignment');
    }
  };

  // Función para desasignar dispositivo
  const handleUnassign = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro de desasignar este dispositivo?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desasignar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://3.82.92.155:3000/asignaciones/desasignar/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Error al desasignar');
        }
        
        // Filtrar la asignación eliminada del estado
        setAssignments(assignments.filter(assignment => assignment.id !== id));
        
        showSuccessAlert('Dispositivo desasignado con éxito');
      } catch (error) {
        console.error(error);
        showErrorAlert('Error al desasignar el dispositivo');
      }
    }
  };

  return (
    <div className="home-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="device-list-container">
          <h2>Lista de Asignación de Dispositivos</h2>
          <button onClick={handleCreateAssignment} className="add-btn">
            Asignar un nuevo dispositivo
          </button>
          <table className={assignments.length === 0 ? 'empty-table' : 'assignments-table'}>
            <thead>
              <tr>
                <th>Dispositivo</th>
                <th>Placas</th>
                <th>Status</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
                {assignments.length === 0 ? (
                    <tr>
                        <td colSpan="6">No hay asignaciones registradas</td>
                    </tr>
                ) : (
                  assignments.map((assignment, index) => (
                    <tr key={index}>
                      <td>{assignment.dispositivo.nombre || 'Sin dispositivo'}</td>
                      <td>{assignment.unidad.placas}</td>
                      <td>{assignment.unidad.status?.estatus || 'Sin status'}</td>
                      <td>{assignment.unidad.marca?.marca || 'Sin marca'}</td>
                      <td>{assignment.unidad.modelo?.modelo || 'Sin modelo'}</td>
                      <td>
                        <button
                          onClick={() => handleUnassign(assignment.id)}
                          className="delete-btn"
                          aria-label={`Desasignar dispositivo ${assignment.dispositivo.nombre}`}
                        >
                          Desasignar
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

export default DeviceAssignmentList;


