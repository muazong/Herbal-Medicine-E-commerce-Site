import Link from 'next/link';
import Image from 'next/image';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css';

import styles from './card-product.module.css';
import { type Product } from '@/common/interfaces';
import { PATH } from '@/common/enums';
import { env } from '@/common/config';

function CartProduct({ product }: { product: Product }) {
  const { id, name, description, price, sold, rating, category, media } =
    product;

  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        <div className={styles.image}>
          <Image
            src={
              media.length > 0
                ? `${env.SERVER_URL}${media[0].path}`
                : env.PRODUCT_URL
            }
            alt={name}
            fill
            loading="lazy"
          />
        </div>
      </div>

      <Link href={`${PATH.PRODUCTS}/${id}`} className={styles.content}>
        <div className={styles.rating}>
          <div className={styles.ratingCountWrapper}>
            <span className={styles.ratingCount}>{rating}/5</span>
            <Rating className={styles.stars} value={rating} readOnly />
          </div>
          <hr />

          {/* TODO: Redicrect to product page with category id */}
          <p className={styles.category}>{category ? category.name : ''}</p>
        </div>
        <div className={styles.text}>
          <div>
            <h2>{name}</h2>
            <p>{description}</p>
          </div>

          <div>
            <div>
              <p className={styles.sold}>Đã bán: {sold}</p>
              <p className={styles.price}>{price}vnđ</p>
            </div>

            {/* TODO: Add product to cart */}
            <button className={styles.btn}>Thêm vào giỏ hàng</button>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default CartProduct;
