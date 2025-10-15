import { use } from 'react';
import Link from 'next/link';
import styles from './sidebar.module.css';

import ShowAll from './show-all';
import { PATH } from '@/common/enums';
import Title from '@/components/title/title';
import { getCategories } from '@/services/categories-service';

function Sidebar() {
  const categories = use(getCategories());

  return (
    <div className={styles.container}>
      <Title text="Danh mục sản phẩm" className={styles.title} />
      <aside className={styles.aside}>
        <ul className={styles.list}>
          <ShowAll />
          {categories &&
            categories.map((category) => {
              return (
                <li key={category.id} className={styles.item}>
                  <Link href={`${PATH.PRODUCTS}?categoryId=${category.id}`}>
                    {category.name}
                  </Link>
                </li>
              );
            })}
        </ul>
      </aside>
    </div>
  );
}

export default Sidebar;
