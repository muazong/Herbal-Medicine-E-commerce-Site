import { use } from 'react';

import styles from './products.module.css';
import CartProduct from '../card-product/card-product';
import Title from '../title/title';
import { getProducts } from '@/services/products-service';
import { Product } from '@/common/interfaces';

type ProductsProps = {
  title?: string;
  limit?: number;
  orderBy?: keyof Product;
};

function Products({ title, limit, orderBy }: ProductsProps) {
  const products = use(getProducts(limit, orderBy));

  return (
    <section className={styles.container}>
      {title && <Title text={title} />}

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
