import styles from './products.module.css';
import { Product } from '@/common/interfaces';
import CartProduct from '../card-product/card-product';

type ProductsProps = {
  products: Product[];
};

function Products({ products }: ProductsProps) {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        {products ? (
          products.map((product) => {
            return <CartProduct key={product.id} product={product} />;
          })
        ) : (
          <p>Đang tải...</p>
        )}
      </div>
    </section>
  );
}

export default Products;
