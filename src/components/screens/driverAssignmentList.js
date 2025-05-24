import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from './header';
import Sidebar from './sidebar';
import { showSuccessAlert, showErrorAlert, showConfirmationAlert } from '../config/alertUtils';

function DriverAssignmentList() {
  const [assignments, setAssignments] = useState([]);
  const navigate = useNavigate();

  // Obtener asignaciones desde la API
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await fetch('http://3.82.92.155:3000/chofer/listado');
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

  // Función para redirigir a la página de asignación de chofer
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
      navigate('/driver-assignment');
    }
  };

  // Función para desasignar chofer
  const handleUnassign = async (id) => {
    const result = await Swal.fire({
      title: '¿Estás seguro de desasignar esta unidad?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desasignar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://3.82.92.155:3000/chofer/desasignar/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Error al desasignar');
        }
        
        // Filtrar la asignación eliminada del estado
        setAssignments(assignments.filter(assignment => assignment.id !== id));
        
        showSuccessAlert('Unidad desasignada con éxito');
      } catch (error) {
        console.error(error);
        showErrorAlert('Error al desasignar la unidad');
      }
    }
  };

  return (
    <div className="home-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="device-list-container">
          <h2>Lista de Asignación de Choferes</h2>
          <button
            onClick={handleCreateAssignment}
            className="create-btn"
          >
            Asignar un nuevo chofer
          </button>
          <table className={assignments.length === 0 ? 'empty-table' : 'filled-table'}>
            <thead>
              <tr>
                <th>Placas</th>
                <th>Status</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Chofer</th> {/* Nueva columna para mostrar el chofer */}
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
                    <td>{assignment.unidad.placas}</td>
                    <td>{assignment.unidad.status?.estatus || 'Sin status'}</td> {/* Accede al primer elemento de status */}
                    <td>{assignment.unidad.marca?.marca || 'Sin marca'}</td>  {/* Accede directamente al campo 'marca' */}
                    <td>{assignment.unidad.modelo?.modelo || 'Sin modelo'}</td>  {/* Accede directamente al campo 'modelo' */}

                    <td>{assignment.chofer?.nombre || 'Sin chofer'}</td> {/* Muestra el nombre del chofer */}
                    <td>
                        <button
                            onClick={() => handleUnassign(assignment.id)}
                            className="delete-btn"
                            aria-label={`Desasignar chofer ${assignment.unidad.placas}`}
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

export default DriverAssignmentList;






