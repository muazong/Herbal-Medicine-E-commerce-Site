import { DashboardProduct } from '@/components/admin-page';

async function DashboardProductDetails({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const productId = (await params).productId;

  return (
    <div>
      <DashboardProduct productId={productId} />
    </div>
  );
}

export default DashboardProductDetails;
