import Image from 'next/image';

import heroImage from '@/assets/images/hero_no_bg.png';
import styles from './hero.module.css';
import Button from '../../button/button';
import { PATH } from '@/common/enums';
import { notoSerif } from '@/common/fonts';

function Hero() {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <div className={styles.text}>
          <h1 className={notoSerif.className}>Anvita</h1>
          <p className={notoSerif.className}>
            An tâm từ thiên nhiên - chăm sóc sức khoẻ <br />
            bằng thảo dược an toàn và tinh khiết.
          </p>
        </div>
        <div className={styles.buttons}>
          <Button
            text="Khám phá sản phẩm"
            type="link"
            href={PATH.PRODUCTS}
            className={styles.primary}
          />
          <Button
            text="Tìm hiểu thêm"
            type="link"
            href={PATH.ABOUT}
            className={styles.secondary}
          />
        </div>
      </div>
      <div className={styles.image}>
        <Image src={heroImage} alt="hero" fill />
      </div>
    </section>
  );
}

export default Hero;
