import { ProductDetails } from '@/components/products-page';
import styles from './page.module.css';
import { getProduct } from '@/services/products-service';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ productId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const productId = (await params).productId;
  const product = await getProduct(productId);

  return {
    title: product ? `${product.name} | Anvita` : 'Sản phẩm | Anvita',
    description:
      product?.description || 'Khám phá sản phẩm chất lượng tại Anvita',
    icons: { icon: '/favicon.ico' },
  };
}

async function Product({ params }: { params: Promise<{ productId: string }> }) {
  const productId = (await params).productId;

  return (
    <div className={styles.container}>
      <ProductDetails productId={productId} />
    </div>
  );
}

export default Product;
