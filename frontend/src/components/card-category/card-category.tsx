import Link from 'next/link';
import Image from 'next/image';

import styles from './card-category.module.css';
import { Category } from '@/common/interfaces';
import { env } from '@/common/config';
import { PATH } from '@/common/enums';

function CardCategory({ category }: { category: Category }) {
  return (
    <div className={styles.container}>
      <Link
        href={`${PATH.PRODUCTS}?categoryId=${category.id}`}
        className={styles.link}
      >
        <div className={styles.image}>
          <Image
            src={
              category.image
                ? `${env.SERVER_URL}${category.image.path}`
                : env.PRODUCT_URL
            }
            alt={category.name}
            fill
          />
        </div>
        <p className={styles.name}>{category.name}</p>
      </Link>
    </div>
  );
}

export default CardCategory;
