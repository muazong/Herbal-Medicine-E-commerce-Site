import Image from 'next/image';
import styles from './propose.module.css';
import { Product } from '@/common/interfaces';
import { env } from '@/common/config';
import Link from 'next/link';
import { PATH } from '@/common/enums';
import { shortDesc } from '@/common/lib/short-desc';

function ProposeProductItem({
  product,
  variant,
}: {
  product: Product;
  variant: 'image_1' | 'image_2';
}) {
  return (
    <div className={styles[variant]}>
      <div className={styles.image}>
        <Image
          src={
            product?.media.length > 0
              ? `${env.SERVER_URL}${product.media[0].path}`
              : env.PRODUCT_URL
          }
          alt={product.name}
          fill
          loading="lazy"
        />
      </div>

      <div className={styles.text}>
        <h2>{product.name}</h2>
        <p>{shortDesc(product.description, 30)}</p>
        <Link href={`${PATH.PRODUCTS}/${product.id}`}>Xem chi tiết</Link>
      </div>
    </div>
  );
}

export default ProposeProductItem;
