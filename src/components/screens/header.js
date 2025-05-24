import React from 'react';
import trackWheels from '../../assets/img/header/trackwheels.png';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Header = () => {
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      // Mostrar confirmación antes de cerrar sesión
      const confirmResult = await Swal.fire({
        title: '¿Cerrar sesión?',
        text: '¿Estás seguro de que deseas cerrar sesión?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
      });
      
      // Si el usuario cancela, no seguimos con el proceso
      if (!confirmResult.isConfirmed) {
        return;
      }
      
      // Mostrar indicador de carga
      Swal.fire({
        title: 'Cerrando sesión...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Intentar llamar al backend para invalidar el token
      try {
        await fetch('http://3.82.92.155:3000/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('userToken')}`,
          },
        });
      } catch (apiError) {
        console.warn('Error al comunicarse con el API de logout, continuando con el cierre de sesión local', apiError);
        // Continuamos con el proceso aunque falle la API
      }

      // Limpiamos datos de sesión
      localStorage.removeItem('userToken');
      
      // Notificamos al navegador del cambio en localStorage para que otros componentes se enteren
      window.dispatchEvent(new Event('storage'));
      
      // Cerrar el indicador de carga y mostrar éxito
      await Swal.fire({
        title: 'Sesión cerrada',
        text: 'Has cerrado sesión correctamente',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });
      
      // Redirigir al login
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
      
      // Mostrar error al usuario
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al cerrar sesión',
        icon: 'error'
      });
    }
  };

  return (
    <header className="header">
      <div>
        <img src={trackWheels} className="logo-img" alt="Logo" />
      </div>
      <button onClick={onLogout} className="logout-btn">Cerrar sesión</button>
    </header>
  );
};

export default Header;







