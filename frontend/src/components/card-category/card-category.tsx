import Link from 'next/link';
import Image from 'next/image';

import styles from './card-category.module.css';
import { Category } from '@/common/interfaces';

function CardCategory({ category }: { category: Category }) {
  return (
    <div className={styles.container}>
      <Link href="">
        <div className={styles.image}>
          <Image src={category.image.path} alt={category.name} fill />
        </div>
        <p className={styles.name}>{category.name}</p>
      </Link>
    </div>
  );
}

export default CardCategory;
