import Title from '../title/title';
import { categories } from '@/db';
import styles from './categories.module.css';
import CardCategory from '../card-category/card-category';

function Categories() {
  return (
    <section className={styles.container}>
      <Title text="Danh mục các sản phẩm" />
      <div className={styles.content}>
        {/* FIX: Only show first 5 categories */}
        {categories.map((category) => {
          return <CardCategory category={category} key={category.id} />;
        })}
      </div>
    </section>
  );
}

export default Categories;
