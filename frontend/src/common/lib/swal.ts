import Swal from 'sweetalert2';

export const swal_fire = (title: string) => {
  return Swal.fire({
    title,
    text: 'Hành động này không thể hoàn tác!',
    icon: 'warning',
    color: '#ffffff',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Đồng ý',
    cancelButtonText: 'Huỷ',
    background: 'rgba(60, 70, 123)',
  });
};
