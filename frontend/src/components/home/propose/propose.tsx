import Image from 'next/image';

import Title from '@/components/title/title';
import styles from './propose.module.css';
import { products } from '@/db';

function Propose() {
  return (
    <section className={styles.container}>
      <Title text="Có thể bạn sẽ thích" />

      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <div className={styles.image_1}>
            <div className={styles.image}>
              <Image src="https://placehold.co/600x400" alt="" fill />
            </div>

            <div className={styles.text}>
              <h2>{products[0].name}</h2>
              <p>{products[0].description}</p>
              <button>Xem chi tiết</button>
            </div>
          </div>

          <div className={styles.image_2}>
            <div className={styles.image}>
              <Image src="https://placehold.co/600x400" alt="" fill />
            </div>

            <div className={styles.text}>
              <h2>{products[1].name}</h2>
              <p>{products[1].description}</p>
              <button>Xem chi tiết</button>
            </div>
          </div>
        </div>
        <div className={styles.imageContainer}>
          <div className={styles.image_2}>
            <div className={styles.image}>
              <Image src="https://placehold.co/600x400" alt="" fill />
            </div>

            <div className={styles.text}>
              <h2>{products[1].name}</h2>
              <p>{products[1].description}</p>
              <button>Xem chi tiết</button>
            </div>
          </div>

          <div className={styles.image_1}>
            <div className={styles.image}>
              <Image src="https://placehold.co/600x400" alt="" fill />
            </div>

            <div className={styles.text}>
              <h2>{products[0].name}</h2>
              <p>{products[0].description}</p>
              <button>Xem chi tiết</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Propose;
