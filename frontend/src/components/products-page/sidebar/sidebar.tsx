import Link from 'next/link';
import styles from './sidebar.module.css';

import { categories } from '@/db';
import { PATH } from '@/common/enums';

function Sidebar() {
  return (
    <aside className={styles.container}>
      <ul className={styles.list}>
        <li className={styles.item}>
          <Link href={PATH.PRODUCTS}>Tất cả</Link>
        </li>
        {categories.map((category) => {
          return (
            <li key={category.id} className={styles.item}>
              <Link href={`${PATH.PRODUCTS}/${category.id}`}>
                {category.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}

export default Sidebar;
