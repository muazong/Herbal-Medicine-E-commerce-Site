import Link from 'next/link';
import Image from 'next/image';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

import styles from './card-product.module.css';
import { type Product } from '@/common/interfaces';

function CartProduct({ product }: { product: Product }) {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <div className={styles.image}>
          <Image
            src={product.media[0].path}
            alt={product.name}
            fill
            loading="lazy"
          />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.rating}>
          <Rating className={styles.stars} value={product.rating} readOnly />
          <hr />
          {/* TODO: Redicrect to product page with category id */}
          <Link className={styles.category} href="">
            {product.category.name}
          </Link>
        </div>
        <div className={styles.text}>
          <div>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
          </div>

          <p className={styles.price}>{product.price}vnđ</p>

          {/* TODO: Add product to cart */}
          <button className={styles.btn}>Thêm vào giỏ hàng</button>
        </div>
      </div>
    </div>
  );
}

export default CartProduct;
