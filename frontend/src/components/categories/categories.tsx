import { use } from 'react';

import Title from '../title/title';
import styles from './categories.module.css';
import CardCategory from '../card-category/card-category';
import { getCategories } from '@/services/categories-service';

function Categories() {
  const categories = use(getCategories(5));

  return (
    <section className={styles.container}>
      <Title text="Danh mục các sản phẩm" />
      <div className={styles.content}>
        {categories &&
          categories.map((category) => {
            return <CardCategory category={category} key={category.id} />;
          })}
      </div>
    </section>
  );
}

export default Categories;
