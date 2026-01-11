import { PATH } from '@/common/enums';
import { redirect } from 'next/navigation';

function AdminPage() {
  redirect(PATH.DASHBOARD);
}

export default AdminPage;
