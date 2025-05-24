import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Header from './header';
import Sidebar from './sidebar';
import { showSuccessAlert, showErrorAlert, showConfirmationAlert } from '../config/alertUtils';
import { data } from 'autoprefixer';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  // Obtener empleados desde la API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('http://3.82.92.155:3000/empleado');
        if (!response.ok) {
          throw new Error('Error al obtener los empleados');
          
        }
        const data = await response.json();
        setEmployees(data);
      } catch (error) {
        console.error(error);
        showErrorAlert('Error al obtener los empleados');
      }
    };

    fetchEmployees();
  }, []);

  // Función para eliminar un empleado
  const handleDelete = async (id) => {
    const confirmDelete = await showConfirmationAlert('¿Estás seguro de que deseas eliminar este empleado?');
    if (confirmDelete.isConfirmed) {
      try {
        const response = await fetch(`http://3.82.92.155:3000/empleado/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          showSuccessAlert('Empleado eliminado correctamente');
          setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.id !== id));
        } else {
          showErrorAlert('Error al eliminar el empleado');
        }
      } catch (error) {
        console.error('Error al eliminar empleado:', error);
        showErrorAlert('Ocurrió un error al eliminar el empleado');
      }
    }
  };

  // Función para redirigir a la página de editar
  const handleEdit = (id) => {
    navigate(`/empleado/${id}/edit`);
  };

  // Función para redirigir a la página de creación
  const handleCreateEmployee = async () => {
    const result = await Swal.fire({
      title: '¿Quieres agregar un nuevo empleado?',
      text: 'Serás redirigido a la página de creación.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, agregar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
    });

    if (result.isConfirmed) {
      navigate('/create-employee');
    }
  };

  return (
    <div className="home-container">
      <Header />
      <div className="main-content">
        <Sidebar />
        <div className="device-list-container">
          <h2>Lista de Empleados</h2>
          <button
            onClick={handleCreateEmployee}
          >
            Agregar Nuevo Empleado
          </button>
          <table className={employees.length === 0 ? '' : ''}>
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Teléfono</th>
                <th>Nombre de usuario</th>
                <th>E-mail</th>
                <th>Rol ID</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td colSpan="6">No hay empleados registrados</td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.id}</td>
                    <td>{employee.nombre}</td>
                    <td>{employee.apellidos}</td>
                    <td>{employee.numTel}</td>
                    <td>{employee.nombreUsuario}</td>
                    <td>{employee.email}</td>
                    <td>{employee.rolId}</td>
                    <td>{employee.rol.rol}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(employee.id)}
                        className="edit-btn"
                        aria-label={`Editar empleado ${employee.id}`}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(employee.id)}
                        className="delete-btn"
                        aria-label={`Eliminar empleado ${employee.id}`}
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

export default EmployeeList;
