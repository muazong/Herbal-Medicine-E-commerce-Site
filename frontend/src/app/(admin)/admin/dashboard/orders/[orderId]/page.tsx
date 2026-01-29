import { DashboardOrder } from '@/components/admin-page';

async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const orderId = (await params).orderId;

  return <DashboardOrder orderId={orderId} />;
}

export default AdminOrderDetailPage;
