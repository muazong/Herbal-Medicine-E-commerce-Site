import Image from 'next/image';
import styles from './trust-badges.module.css';

import freeShipping from '@/assets/images/free_ship_no_bg.png';
import twentyFourHours from '@/assets/images/24h_no_bg.png';
import allowGoodsInspection from '@/assets/images/allow_goods_inspection_no_bg.png';
import quality from '@/assets/images/quality_no_bg.png';

function TrustBadges() {
  return (
    <section className={styles.container}>
      <ul className={styles.list}>
        <li className={styles.item}>
          <div className={styles.itemImage}>
            <Image src={freeShipping} alt="free shipping" fill />
          </div>
          <p>Miễn phí vận chuyển</p>
        </li>
        <li className={styles.item}>
          <div className={styles.itemImage}>
            <Image src={twentyFourHours} alt="twenty four hours" fill />
          </div>
          <p>Hỗ trợ 24h</p>
        </li>
        <li className={styles.item}>
          <div className={styles.itemImage}>
            <Image
              src={allowGoodsInspection}
              alt="allow goods inspection"
              fill
            />
          </div>
          <p>Kiểm tra hàng</p>
        </li>
        <li className={styles.item}>
          <div className={styles.itemImage}>
            <Image src={quality} alt="quality" fill />
          </div>
          <p>Đảm bảo chất lượng</p>
        </li>
      </ul>
    </section>
  );
}

export default TrustBadges;
