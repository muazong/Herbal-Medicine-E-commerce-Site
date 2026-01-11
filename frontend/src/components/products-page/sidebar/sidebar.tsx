import { use } from 'react';
import styles from './sidebar.module.css';

import ShowAll from './show-all';
import SidebarItem from './sidebar-item';
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
              return <SidebarItem key={category.id} category={category} />;
            })}
        </ul>
      </aside>
    </div>
  );
}

export default Sidebar;
