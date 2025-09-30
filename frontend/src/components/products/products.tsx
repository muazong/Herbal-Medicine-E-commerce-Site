import { products } from '@/db';
import styles from './products.module.css';
import CartProduct from '../card-product/card-product';
import Title from '../title/title';

type ProductsProps = {
  title: string;
};

function Products({ title }: ProductsProps) {
  return (
    <section className={styles.container}>
      <Title text={title} />

      <div className={styles.content}>
        {products.map((product) => {
          return <CartProduct key={product.id} product={product} />;
        })}
      </div>
    </section>
  );
}

export default Products;
