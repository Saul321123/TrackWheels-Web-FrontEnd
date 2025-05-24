import React, { useState, useEffect } from 'react';
import Header from './header';
import Sidebar from './sidebar';
import { useParams, useNavigate } from 'react-router-dom';
import { showSuccessAlert, showErrorAlert } from '../config/alertUtils'; // Importamos las alertas

const EditEmployee = () => {
  const [employee, setEmployee] = useState({
    nombre: '',
    apellidos: '',
    numTel: '',
    nombreUsuario: '',
    contrasena: '',
    email: '',
    rolId: 1,
  });

  const [roles, setRoles] = useState([]); // Estado para almacenar los roles
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  // Cargar los datos del empleado desde la API
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`http://3.82.92.155:3000/empleado/${id}`);
        const data = await response.json();
        setEmployee({
          ...data[0],
          rolId: data[0].rolId, // Asegurarse de que `rolId` sea parte del estado
        });
      } catch (error) {
        console.error('Error al cargar el empleado:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  // Cargar los roles desde la API
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://3.82.92.155:3000/rol');
        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error('Error al cargar los roles:', error);
      }
    };

    fetchRoles();
  }, []);

  const handleChange = (e) => {
    setEmployee({
      ...employee,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Crear un nuevo objeto con solo las propiedades necesarias
    const payload = {
      nombre: employee.nombre,
      apellidos: employee.apellidos,
      numTel: employee.numTel,
      nombreUsuario: employee.nombreUsuario,
      contrasena: employee.contrasena,
      email: employee.email,
      rolId: employee.rolId, // Asegurarse de que solo enviamos el ID del rol
    };

    try {
      const response = await fetch(`http://3.82.92.155:3000/empleado/${id}/edit`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Enviar solo las propiedades necesarias
      });

      if (response.ok) {
        showSuccessAlert('Empleado editado exitosamente', '/employee-list');
      } else {
        showErrorAlert('Error al editar el empleado');
        console.log(payload);
      }
    } catch (error) {
      console.error('Error al editar el empleado:', error);
      showErrorAlert('Ocurrió un error, intenta nuevamente.');
    }
  };

  if (loading) {
    return <p>Cargando datos del empleado...</p>;
  }

  return (
    <div className="home-container">
      <Header />

      <div className="main-content">
        <Sidebar />

        <div className="form-container">
          <h2>Editar Empleado</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={employee.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Apellidos:</label>
              <input
                type="text"
                name="apellidos"
                value={employee.apellidos}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Número de Teléfono:</label>
              <input
                type="tel"
                name="numTel"
                value={employee.numTel}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                placeholder="Ejemplo: 735105517"
              />
            </div>

            <div className="form-group">
              <label>Nombre de Usuario:</label>
              <input
                type="text"
                name="nombreUsuario"
                value={employee.nombreUsuario}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                name="contrasena"
                value={employee.contrasena}
                onChange={handleChange}
                required
                minLength="6"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <div className="form-group">
              <label>Correo Electrónico:</label>
              <input
                type="email"
                name="email"
                value={employee.email}
                onChange={handleChange}
                required
                placeholder="Ejemplo: usuario@dominio.com"
              />
            </div>

            <div className="form-group">
              <label>Rol:</label>
              <select
                name="rolId"
                value={employee.rolId}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Selecciona un rol
                </option>
                {roles.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.rol}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit">Actualizar Empleado</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;


