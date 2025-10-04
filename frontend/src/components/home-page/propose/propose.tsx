import { use } from 'react';
import Title from '@/components/title/title';
import styles from './propose.module.css';
import ProposeProductItem from './propose-product-item';
import { getProducts } from '@/services/products-service';

function ProposeProducts() {
  const products = use(getProducts(4));

  if (!products) return null;
  if (products.length !== 4) return null;

  return (
    <section className={styles.container}>
      <Title text="Có thể bạn sẽ thích" />

      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <ProposeProductItem product={products[0]} variant="image_1" />
          <ProposeProductItem product={products[1]} variant="image_2" />
        </div>

        <div className={styles.imageContainer}>
          <ProposeProductItem product={products[2]} variant="image_2" />
          <ProposeProductItem product={products[3]} variant="image_1" />
        </div>
      </div>
    </section>
  );
}

export default ProposeProducts;
