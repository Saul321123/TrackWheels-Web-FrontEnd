import React, { useState } from 'react';

function Register() {
  const [form, setForm] = useState({
    nombre: '', apellidos: '', telefono: '', username: '', password: '', email: '', rol: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lógica para registrar al usuario
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit}>
        <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} />
        <input type="text" name="apellidos" placeholder="Apellidos" onChange={handleChange} />
        <input type="tel" name="telefono" placeholder="Teléfono" onChange={handleChange} />
        <input type="text" name="username" placeholder="Usuario" onChange={handleChange} />
        <input type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} />
        <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} />
        <input type="text" name="rol" placeholder="Rol" onChange={handleChange} />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}

export default Register;
