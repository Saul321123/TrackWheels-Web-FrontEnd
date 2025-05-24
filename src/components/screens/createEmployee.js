// src/pages/CreateUser.js
import React, { useState, useEffect } from 'react';
import Header from './header';
import Sidebar from './sidebar';
import { showSuccessAlert, showErrorAlert } from '../config/alertUtils';

const handleLogout = () => {
  // Lógica para cerrar sesión
};

const CreateEmployee = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [numTel, setNumTel] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [email, setEmail] = useState('');
  const [rolId, setRolId] = useState(1);
  const [roles, setRoles] = useState([]); // Estado para almacenar los roles

  // Cargar los roles dinámicamente desde la API
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = {
      nombre,
      apellidos,
      numTel,
      nombreUsuario,
      contrasena,
      email,
      rolId,
    };

    try {
      const response = await fetch('http://3.82.92.155:3000/empleado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Empleado creado con éxito:', data);
        showSuccessAlert('Empleado creado exitosamente.', '/employee-list');
      } else {
        throw new Error('Error al crear el empleado');
      }
    } catch (error) {
      console.error('Error al hacer la solicitud:', error);
      showErrorAlert('Ocurrió un error al crear el empleado. Intenta nuevamente.');
    }
  };

  return (
    <div className="home-container">
      {/* Header */}
      <Header onLogout={handleLogout} />

      <div className="main-content">
        {/* Sidebar */}
        <Sidebar />

        {/* Formulario Crear Usuario */}
        <div className="form-container">
          <h2>Crear Usuario</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Apellidos:</label>
              <input
                type="text"
                value={apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Número de Teléfono:</label>
              <input
                type="tel"
                value={numTel}
                onChange={(e) => setNumTel(e.target.value)}
                required
                placeholder="Ejemplo: 735105517"
              />
            </div>
            <div className="form-group">
              <label>Nombre de Usuario:</label>
              <input
                type="text"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Contraseña:</label>
              <input
                type="password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                required
                minLength="6"
                placeholder="Mínimo 6 caracteres"
              />
            </div>
            <div className="form-group">
              <label>Correo Electrónico:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Ejemplo: usuario@dominio.com"
              />
            </div>
            <div className="form-group">
              <label>Rol:</label>
              <select value={rolId} onChange={(e) => setRolId(Number(e.target.value))} required>
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
            <button type="submit">Crear Usuario</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployee;


