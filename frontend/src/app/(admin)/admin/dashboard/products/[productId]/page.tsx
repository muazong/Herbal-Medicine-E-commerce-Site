import { Metadata } from 'next';
import { getProduct } from '@/services/products-service';
import { DashboardProduct } from '@/components/admin-page';

type Props = {
  params: Promise<{ productId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const productId = (await params).productId;
  const product = await getProduct(productId);

  return {
    title: product
      ? `${product.name} | Quản lý Anvita`
      : 'Sản phẩm | Quản lý Anvita',
  };
}

async function DashboardProductDetails({ params }: Props) {
  const productId = (await params).productId;

  return (
    <div>
      <DashboardProduct productId={productId} />
    </div>
  );
}

export default DashboardProductDetails;
