import Swal from 'sweetalert2';

// Función para mostrar alerta de éxito
export const showSuccessAlert = (message, redirect = '') => {
  Swal.fire({
    icon: 'success',
    title: '¡Listo!',
    text: message,
    showConfirmButton: false,
    timer: 1500
  }).then(() => {
    if (redirect) {
      window.location.href = redirect; // Si necesitas redirigir a alguna página
    }
  });
};

// Función para mostrar alerta de error
export const showErrorAlert = (message) => {
  Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message
  });
};

// Función para mostrar alerta de advertencia
export const showWarningAlert = (message) => {
  Swal.fire({
    icon: 'warning',
    title: 'Advertencia',
    text: message
  });
};

// Función para mostrar alerta de confirmación
export const showConfirmationAlert = (message) => {
  return Swal.fire({
    title: message,
    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar'
  });
};
